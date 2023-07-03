import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    MatButtonModule, MatDialogModule
  ],
  exports: [
    MatButtonModule, MatDialogModule
  ]
})
export class CustomMaterialModule {
}