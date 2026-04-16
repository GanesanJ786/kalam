import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, take, shareReplay, switchMap } from 'rxjs/operators';
import { KalamService } from './kalam.service';
import { PlanId, PlanLimits, SubscriptionPlan, SUBSCRIPTION_PLANS, getPlanById, getDefaultPlan } from './constant';

export interface AcademySubscription {
  academyId: string;
  planId: PlanId;
  billingCycle: 'MONTHLY' | 'ANNUAL';
  startDate: string;
  renewalDate: string;
  trialEndDate?: string;
  status: 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
}

export interface AcademyUsage {
  coachCount: number;
  studentCount: number;
  groundCount: number;
}

export type ResourceType = 'coach' | 'student' | 'ground';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private _subscriptionCache: Map<string, Observable<AcademySubscription | null>> = new Map();
  private _usageCache: Map<string, Observable<AcademyUsage>> = new Map();

  constructor(
    private fireStore: AngularFirestore,
    private kalamService: KalamService
  ) {}

  getSubscription(academyId: string): Observable<AcademySubscription | null> {
    if (!this._subscriptionCache.has(academyId)) {
      const sub$ = this.fireStore.collection('academySubscription', ref =>
        ref.where('academyId', '==', academyId).limit(1)
      ).get().pipe(
        map(snapshot => {
          if (snapshot.docs.length === 0) return null;
          const doc = snapshot.docs[0];
          return {
            id: doc.id,
            ...doc.data() as any
          } as AcademySubscription;
        }),
        shareReplay({ bufferSize: 1, refCount: true })
      );
      this._subscriptionCache.set(academyId, sub$);
    }
    return this._subscriptionCache.get(academyId)!;
  }

  getCurrentPlan(academyId: string): Observable<SubscriptionPlan> {
    return this.getSubscription(academyId).pipe(
      map(sub => {
        if (!sub) return getDefaultPlan();
        const plan = getPlanById(sub.planId);
        return plan || getDefaultPlan();
      })
    );
  }

  getUsage(academyId: string): Observable<AcademyUsage> {
    if (!this._usageCache.has(academyId)) {
      const coachId = academyId.replace('A', '');

      const coaches$ = this.fireStore.collection('coachDetails', ref =>
        ref.where('academyId', '==', academyId)
      ).get().pipe(
        map(snapshot => snapshot.docs.length)
      );

      const students$ = this.fireStore.collection('studentDetails', ref =>
        ref.where('coachId', '==', coachId).where('inActive', '!=', true)
      ).get().pipe(
        map(snapshot => snapshot.docs.length)
      );

      const grounds$ = this.fireStore.collection('groundDetails', ref =>
        ref.where('academyId', '==', coachId)
      ).get().pipe(
        map(snapshot => snapshot.docs.length)
      );

      const usage$ = coaches$.pipe(
        switchMap(coachCount => students$.pipe(
          switchMap(studentCount => grounds$.pipe(
            map(groundCount => ({ coachCount, studentCount, groundCount }))
          ))
        )),
        shareReplay({ bufferSize: 1, refCount: true })
      );
      this._usageCache.set(academyId, usage$);
    }
    return this._usageCache.get(academyId)!;
  }

  checkLimit(academyId: string, resource: ResourceType): Observable<{ allowed: boolean; current: number; limit: number; planName: string }> {
    return this.getCurrentPlan(academyId).pipe(
      switchMap(plan => this.getUsage(academyId).pipe(
        map(usage => {
          let current: number;
          let limit: number;
          switch (resource) {
            case 'coach':
              current = usage.coachCount;
              limit = plan.limits.maxCoaches;
              break;
            case 'student':
              current = usage.studentCount;
              limit = plan.limits.maxStudents;
              break;
            case 'ground':
              current = usage.groundCount;
              limit = plan.limits.maxGrounds;
              break;
          }
          return { allowed: current < limit, current, limit, planName: plan.name };
        })
      ))
    );
  }

  createSubscription(academyId: string, planId: PlanId, billingCycle: 'MONTHLY' | 'ANNUAL'): Promise<any> {
    const now = new Date();
    const plan = getPlanById(planId);
    const isTrialPlan = planId === 'FREE_TRIAL';

    const renewalDate = new Date(now);
    if (isTrialPlan) {
      renewalDate.setDate(renewalDate.getDate() + (plan?.trialDays || 30));
    } else if (billingCycle === 'ANNUAL') {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    } else {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    }

    const subscription: AcademySubscription = {
      academyId,
      planId,
      billingCycle,
      startDate: now.toISOString(),
      renewalDate: renewalDate.toISOString(),
      status: isTrialPlan ? 'TRIAL' : 'ACTIVE',
      ...(isTrialPlan && { trialEndDate: renewalDate.toISOString() })
    };

    this.invalidateCache(academyId);
    return this.fireStore.collection('academySubscription').add(subscription);
  }

  updatePlan(academyId: string, newPlanId: PlanId, billingCycle: 'MONTHLY' | 'ANNUAL'): Observable<void> {
    return this.fireStore.collection('academySubscription', ref =>
      ref.where('academyId', '==', academyId).limit(1)
    ).snapshotChanges().pipe(
      take(1),
      map(actions => {
        if (actions.length === 0) {
          this.createSubscription(academyId, newPlanId, billingCycle);
          return;
        }
        const docId = actions[0].payload.doc.id;
        const now = new Date();
        const renewalDate = new Date(now);
        if (billingCycle === 'ANNUAL') {
          renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        } else {
          renewalDate.setMonth(renewalDate.getMonth() + 1);
        }
        this.fireStore.doc(`academySubscription/${docId}`).update({
          planId: newPlanId,
          billingCycle,
          renewalDate: renewalDate.toISOString(),
          status: 'ACTIVE'
        });
        this.invalidateCache(academyId);
      })
    );
  }

  invalidateCache(academyId: string) {
    this._subscriptionCache.delete(academyId);
    this._usageCache.delete(academyId);
  }
}
