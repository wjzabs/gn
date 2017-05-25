import { Injectable } from '@angular/core';

export interface MenuItem {
    text: string,
    icon: string,
    route: string,
    submenu: Array<MenuItem>
}

@Injectable()
export class MenuService {
    
    // items: Array<any>;  // so that the app is bound to a specific type
    items: Array<MenuItem>;
    isVertical = false;
    showingLeftSideMenu = false;

    toggleLeftSideMenu() : void {
        this.isVertical = true; // dont like this
        this.showingLeftSideMenu = !this.showingLeftSideMenu;
    }

    toggleMenuOrientation() {
        this.isVertical = !this.isVertical;
    }
}