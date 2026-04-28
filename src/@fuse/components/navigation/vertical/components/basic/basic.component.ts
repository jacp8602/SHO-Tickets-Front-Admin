import { NgClass, NgStyle, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  Input,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
  IsActiveMatchOptions,
  RouterLink,
  RouterLinkActive,
} from "@angular/router";
import { FuseNavigationService } from "@fuse/components/navigation/navigation.service";
import { FuseNavigationItem } from "@fuse/components/navigation/navigation.types";
import { FuseVerticalNavigationComponent } from "@fuse/components/navigation/vertical/vertical.component";
import { FuseUtilsService } from "@fuse/services/utils/utils.service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "fuse-vertical-navigation-basic-item",
  templateUrl: "./basic.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgStyle,
    RouterLink,
    RouterLinkActive,
    MatTooltipModule,
    NgTemplateOutlet,
    MatIconModule,
  ],
})
export class FuseVerticalNavigationBasicItemComponent
  implements OnInit, OnDestroy
{
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _fuseNavigationService = inject(FuseNavigationService);
  private _fuseUtilsService = inject(FuseUtilsService);

  @Input() item: FuseNavigationItem;
  @Input() name: string;

  // Set the equivalent of {exact: false} as default for active match options.
  // We are not assigning the item.isActiveMatchOptions directly to the
  // [routerLinkActiveOptions] because if it's "undefined" initially, the router
  // will throw an error and stop working.
  isActiveMatchOptions: IsActiveMatchOptions =
    this._fuseUtilsService.subsetMatchOptions;

  private _navComponent = signal<FuseVerticalNavigationComponent | null>(null);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  isActive = computed(() => {
    const navComponent = this._navComponent();
    if (!navComponent || !this.item?.id) {
      return false;
    }
    return navComponent.activeMenuItemId() === this.item.id;
  });

  cssVariables = computed<{ [key: string]: string }>(() => {
    if (!this.isActive() || !this.item?.activeColors) {
      return {};
    }
    const vars: { [key: string]: string } = {};
    if (this.item.activeColors.text) {
      vars["--menu-active-text-color"] = this.item.activeColors.text;
    }
    // if (this.item.activeColors.icon) {
    //     vars['--menu-active-icon-color'] = this.item.activeColors.icon;
    // }
    if (this.item.activeColors.background) {
      vars["--menu-active-bg-color"] = this.item.activeColors.background;
    }
    return vars;
  });

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the "isActiveMatchOptions" either from item's
    // "isActiveMatchOptions" or the equivalent form of
    // item's "exactMatch" option
    this.isActiveMatchOptions =
      (this.item.isActiveMatchOptions ?? this.item.exactMatch)
        ? this._fuseUtilsService.exactMatchOptions
        : this._fuseUtilsService.subsetMatchOptions;

    // Get the parent navigation component and expose it to signals
    this._navComponent.set(this._fuseNavigationService.getComponent(this.name));

    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Subscribe to onRefreshed on the navigation component
    this._navComponent()
      .onRefreshed.pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Handle item click to set this item as active
   */
  onItemClick(): void {
    const navComponent = this._navComponent();
    if (this.item?.id && navComponent) {
      navComponent.setActiveMenuItem(this.item.id);
    }
  }
}
