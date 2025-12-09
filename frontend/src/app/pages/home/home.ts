import { Component } from '@angular/core';
import {TopAuthors} from './top-authors/top-authors';
import {TopFavourite} from './top-favourite/top-favourite';
import {HighestRatings} from './highest-ratings/highest-ratings';

@Component({
  selector: 'app-home',
  imports: [
    TopAuthors,
    TopFavourite,
    HighestRatings
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export default class Home {

}
