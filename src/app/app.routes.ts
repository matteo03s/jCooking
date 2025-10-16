import { Routes } from '@angular/router';

export const routes: Routes = [

  {path: 'recipes', loadComponent:() =>import("./pages/recipes/recipes")},
  {path: 'ingredients', loadComponent:() =>import("./pages/ingredients/ingredients")}

];
