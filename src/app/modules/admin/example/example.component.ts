import { Component, ViewEncapsulation } from '@angular/core';
import { OrderRefundComponent } from '../order-refund/order-refund.component';

@Component({
    selector     : 'example',
    standalone   : true,
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [OrderRefundComponent],
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
