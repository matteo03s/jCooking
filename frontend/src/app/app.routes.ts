import {Routes} from '@angular/router';
import {AuthGuard} from './core/store/authentication/guard-interceptor/AuthGuard';
import {AlreadyLoggedInGuard} from './core/store/authentication/guard-interceptor/AlreadyLoggedInGuard';

export const routes: Routes = [


  {
    path: 'recipes',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/recipes/recipes'),
      },
      {
        path: 'tag/:tag',
        loadComponent: () => import('./pages/recipes/recipes'),
      },
      {
        path: 'category/:category',
        loadComponent: () => import('./pages/recipes/recipes'),
      },
      {
        path: 'user/:username',
        loadComponent: () => import('./pages/recipes/recipes'),
      },
      {
        path: 'my',
        loadComponent: () => import('./pages/recipes/recipes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/recipe-form/recipe-form'),
        canActivate: [AuthGuard],
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/recipes/recipe-details/recipe-details'),
      },

      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/recipe-form/recipe-edit')
      },

      {
        path: 'uploadImage/:id',
        loadComponent: () => import('./pages/recipe-form/form-image/form-image')
      }
    ],
  },

  {
    path: 'reviews',
    children: [
      {
        path: '',
        loadComponent: () => import("./pages/reviews/review-list/review-list")
      },
      {
        path: 'new/:recipeId',
        loadComponent: () => import("./pages/reviews/review-form/review-form"),
        canActivate: [AuthGuard]
      },
      {
        path: 'recipe/:recipeId',
        loadComponent: () => import("./pages/reviews/review-list/review-list")
      },
      {
        path: 'user/:username',
        loadComponent: () => import("./pages/reviews/review-list/review-list")
      },
      {
        path: 'my',
        loadComponent: () => import("./pages/reviews/review-list/review-list"),
        canActivate: [AuthGuard]
      },
    ]
  },

  {
    path: 'users',
    children : [
      {
        path: 'edit',
        loadComponent: () => import("./pages/user-page/user-update/user-update"),
        canActivate: [AuthGuard]
      },
      {
        path: 'other',
        loadComponent: () => import("./pages/friendships/users/users"),
        canActivate: [AuthGuard]
      },
      {
        path: 'my',
        loadComponent: () => import("./pages/user-page/user-page"),
        canActivate: [AuthGuard]
      },
      {
        path: 'my/favourites',
        loadComponent: () => import("./pages/my-favourites/my-favourites"),
        canActivate: [AuthGuard]
      },
      {
        path: 'my/friends',
        loadComponent: () => import("./pages/friendships/friends/friends"),
        canActivate: [AuthGuard]
      },
      {
        path: 'my/request',
        loadComponent: () => import("./pages/friendships/friend-requests/friend-requests"),
        canActivate: [AuthGuard]
      },

    ]
  },

  { path: 'generator', loadComponent: () => import("./pages/ai-chef/ai-chef")},
  { path: 'about', loadComponent: () => import("./pages/home/about/about")},
  { path: '', loadComponent: () => import("./pages/home/home")},
  { path: 'categories', loadComponent: () => import("./pages/categories/categories")},
  { path: 'choose', loadComponent: () => import("./pages/avatar-selection/avatar-selection")},
  { path: 'equivalences', loadComponent: () => import("./pages/equivalences/equivalences")},
  { path: 'sign-in', loadComponent: () => import("./pages/sign-in/sign-in"), canActivate: [AlreadyLoggedInGuard]},
  { path: 'sign-up', loadComponent: () => import("./pages/sign-up/sign-up"), canActivate: [AlreadyLoggedInGuard]},
  { path: 'logout', loadComponent: () => import("./core/store/authentication/model/Logout.component"), canActivate: [AuthGuard] },

];
