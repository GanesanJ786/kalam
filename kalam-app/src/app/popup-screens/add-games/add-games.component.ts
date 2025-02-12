import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface TournamentDetails {
  id?: string;
  name: string;
  gameDate: any;
}

@Component({
  selector: 'app-add-games',
  templateUrl: './add-games.component.html',
  styleUrls: ['./add-games.component.scss']
})

export class AddGamesComponent implements OnInit {

  constructor() { 
    this.tournamentDetails = {} as TournamentDetails;
  }

  gameForm!: FormGroup;
  tournamentDetails: TournamentDetails;

  ngOnInit(): void {
    this.gameForm = new FormGroup({
      tournamentName: new FormControl(this.tournamentDetails.name,[Validators.required]),
      gameDate: new FormControl(this.tournamentDetails.gameDate, [Validators.required]),
    })
  }

}
