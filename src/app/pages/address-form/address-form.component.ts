import { Component, OnInit } from '@angular/core';

interface Address {
  id: string;
  name: string;
  parentId?: string;
}

interface Country {
  countryName: string;
  states: any;
}

interface State {
  stateName: string;
  districts: any;
}

interface District {
  districtName: string;
  places: any;
}

interface Place {
  placeName: string;
}

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent implements OnInit {
  tree: any = [];
  countries: any = [];
  states: any = [];
  districts: any = [];
  places: any = [];
  countryName: string = '';
  stateName: string = '';
  districtName: string = '';
  placeName: string = '';

  constructor() {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    const firstLevelArr: Address[] = [
      { id: '1', name: 'India' },
      { id: '2', name: 'Germany' },
    ];
    const secondLevelArr: Address[] = [
      { id: 's1', parentId: '2', name: 'Bavaria' },
      { id: 's2', parentId: '2', name: 'Berlin' },
      { id: 's3', parentId: '1', name: 'Maharashtra' },
      { id: 's4', parentId: '1', name: 'Tamilnadu' },
    ];
    const thirdLevelArr: Address[] = [
      { id: 'd1', parentId: 's1', name: 'Upper Bavaria' },
      { id: 'd2', parentId: 's1', name: 'Lower Bavaria' },
      { id: 'd3', parentId: 's2', name: 'Berlin-Mitte' },
      { id: 'd4', parentId: 's2', name: 'Kreuzberg' },
      { id: 'd5', parentId: 's3', name: 'Nashik' },
      { id: 'd6', parentId: 's3', name: 'Jalgoan' },
      { id: 'd7', parentId: 's4', name: 'Ariyalur' },
      { id: 'd8', parentId: 's4', name: 'Chennai' },
    ];
    const fourthLevelArr: Address[] = [
      { id: 'p1', parentId: 'd1', name: 'Munich' },
      { id: 'p2', parentId: 'd1', name: 'Erding' },
      { id: 'p3', parentId: 'd2', name: 'Leipzig' },
      { id: 'p4', parentId: 'd2', name: 'Landshut' },
      { id: 'p5', parentId: 'd3', name: 'Passau' },
      { id: 'p6', parentId: 'd3', name: 'Gesundbrunnen' },
      { id: 'p7', parentId: 'd4', name: 'Frieburg' },
      { id: 'p8', parentId: 'd4', name: 'Hamburg' },
      { id: 'p9', parentId: 'd6', name: 'Raver' },
      { id: 'p10', parentId: 'd6', name: 'Savda' },
      { id: 'p11', parentId: 'd5', name: 'Ozar' },
      { id: 'p12', parentId: 'd5', name: 'Manmad' },
      { id: 'p13', parentId: 'd7', name: 'Thirumanur' },
      { id: 'p14', parentId: 'd7', name: 'Sendurai' },
      { id: 'p15', parentId: 'd8', name: 'New Chennai' },
      { id: 'p16', parentId: 'd8', name: 'Old Chennai' },
    ];

    this.tree = await this.convertToTree(
      firstLevelArr,
      secondLevelArr,
      thirdLevelArr,
      fourthLevelArr
    );

    this.getCountries();
  }

  convertToTree(
    firstLevelArr: any,
    secondLevelArr: any,
    thirdLevelArr: any,
    fourthLevelArr: any
  ) {
    let tree: any = {};

    firstLevelArr.forEach((country: any) => {
      tree[country.id] = {
        countryName: country.name,
        states: {},
      };
    });

    secondLevelArr.forEach((state: any) => {
      const countryId = state.parentId;
      tree[countryId].states[state.id] = {
        stateName: state.name,
        districts: {},
      };
    });

    thirdLevelArr.forEach((district: any) => {
      const stateId = district.parentId;
      const countryId = secondLevelArr.find(
        (state: any) => state.id === stateId
      ).parentId;
      tree[countryId].states[stateId].districts[district.id] = {
        districtName: district.name,
        places: {},
      };
    });

    fourthLevelArr.forEach((place: any) => {
      const districtId = place.parentId;
      const stateId = thirdLevelArr.find(
        (district: any) => district.id === districtId
      ).parentId;
      const countryId = secondLevelArr.find(
        (state: any) => state.id === stateId
      ).parentId;
      tree[countryId].states[stateId].districts[districtId].places[place.id] = {
        placeName: place.name,
      };
    });

    return tree;
  }

  getCountries(): Country[] {
    this.countries = [...Object.values(this.tree)];
    return this.countries;
  }

  getStatesFromCountry(countryName: string): State[] {
    this.states = [];
    this.districts = [];
    this.places = [];

    const obj: any = this.countries.find(
      (obj: any) => obj.countryName === countryName
    );
    this.states = Object.values(obj.states);
    return this.states;
  }

  getDisctrictFromState(stateName: string): District[] {
    this.districts = [];
    this.places = [];

    const obj: any = this.states.find(
      (obj: any) => obj.stateName === stateName
    );
    this.districts = Object.values(obj.districts);
    return this.districts;
  }

  getPlacesFromDisctrict(districtName: string): Place[] {
    this.places = [];
    const obj: any = this.districts.find(
      (obj: any) => obj.districtName === districtName
    );
    this.places = Object.values(obj.places);
    return this.places;
  }
}
