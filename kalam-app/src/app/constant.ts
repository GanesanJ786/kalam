interface SelectItem {
    value: string;
    label: string;
}


export const SportsList: SelectItem[] = [
    {value:'goalkeeper', label: 'Goalkeeper'},
    {value:'defenders', label: 'Defenders'},
    {value:'outsideFullback', label: 'Outside Fullback'},
    {value:'centralDefenders', label: 'Central Defenders'},
    {value:'midfielders', label: 'Midfielders'},
    {value:'forwards', label: 'Forwards'},
    {value:'centerForward', label: 'Center Forward'}
];

export const UnderAge: SelectItem[] = [
    {value:'u-15', label: 'Under-15'},
    {value:'u-16', label: 'Under-16'},
    {value:'u-19', label: 'Under-19'},
    {value:'u-23', label: 'Under-23'},
    {value:'open', label: 'Open'}
];