import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ButtonModule, UIShellModule } from 'carbon-components-angular';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        ButtonModule,
        UIShellModule],
    declarations: [],
    exports: [CommonModule,
        FormsModule,
        FlexLayoutModule,
        ButtonModule,
        UIShellModule
    ]
})
export class CustomCarbonModule { }

