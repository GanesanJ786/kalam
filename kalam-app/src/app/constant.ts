export interface SelectItem {
    value: string;
    label: string;
}

export interface SelectItemNum {
    value: number;
    label: number;
}


export const SportsList: SelectItem[] = [
    {value:'goalkeeper', label: 'Goal Keeper'},
    {value:'defenders', label: 'Defenders'},
    {value:'outsideFullback', label: 'Outside Fullback'},
    {value:'centralDefenders', label: 'Central Defenders'},
    {value:'midfielders', label: 'Mid Fielders'},
    {value:'forwards', label: 'Forwards'},
    {value:'centerForward', label: 'Center Forward'}
];

export const UnderAge: SelectItem[] = [
    {value:'u-5', label: 'Under-5'},
    {value:'u-6', label: 'Under-6'},
    {value:'u-7', label: 'Under-7'},
    {value:'u-8', label: 'Under-8'},
    {value:'u-9', label: 'Under-9'},
    {value:'u-10', label: 'Under-10'},
    {value:'u-11', label: 'Under-11'},
    {value:'u-12', label: 'Under-12'},
    {value:'u-13', label: 'Under-13'},
    {value:'u-14', label: 'Under-14'},
    {value:'u-15', label: 'Under-15'},
    {value:'u-16', label: 'Under-16'},
    {value:'u-17', label: 'Under-17'},
    {value:'u-18', label: 'Under-18'},
    {value:'u-19', label: 'Under-19'},
    {value:'u-20', label: 'Under-20'},
    {value:'u-21', label: 'Under-21'},
    {value:'open', label: 'Open'}
];

export const Scholarship: SelectItem[] = [
    {value:'0', label: 'None'},
    {value:'10', label: '10'},
    {value:'15', label: '15'},
    {value:'25', label: '25'},
    {value:'50', label: '50'},
    {value:'100', label: '100'},
];

export const CompetencyLevel: SelectItem[] = [
    {value:'Beginner', label: 'Beginner'},
    {value:'Intermediate', label: 'Intermediate'},
    {value:'Advanced', label: 'Advanced'}
]

export const Logo = {
    logoUrl: ``
}

export const RatingLevel: SelectItemNum[] = [
    {value:0, label: 0},
    {value:1, label: 1},
    {value:2, label: 2},
    {value:3, label: 3},
    {value:4, label: 4},
    {value:5, label: 5},
    {value:6, label: 6},
    {value:7, label: 7},
    {value:8, label: 8},
    {value:9, label: 9},
    {value:10, label: 10}
]

export const CommonObject = {
    KalamQuality: {
        siteName: 'kalam-quality/VP7oTHU04NqvovnQtWzG',
        siteNameObj: 'KalamQuality',
        bannerImg: "./assets/images/banner/kalam-q/chessB2.jpg",
        academyText: 'Kalam Chess Associations',
        groundLabel: 'Add Venue',
        groundDetails: 'Add Venue Details',
        groundName: "Venue name",
        sportType: "chess",
        ground: "Venue"
    }
}