import { NgModule } from '@angular/core';

import { UserCardComponent } from '../components/user-card/user-card.component';
import { PromotionsComponent } from '../components/promotions/promotions.component';



@NgModule({
  imports: [

    UserCardComponent,
    PromotionsComponent
  ],
  exports: [

     UserCardComponent,
     PromotionsComponent
  ]  
})
export class SharedModulePersonalizate {}
