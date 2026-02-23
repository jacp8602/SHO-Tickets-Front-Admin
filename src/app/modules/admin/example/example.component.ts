import { Component, ViewEncapsulation } from '@angular/core';
import { FeesTaxesComponent } from '../fees_taxes/fees-taxes.component';

@Component({
    selector     : 'example',
    standalone   : true,
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [FeesTaxesComponent,],
})

export class ExampleComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
