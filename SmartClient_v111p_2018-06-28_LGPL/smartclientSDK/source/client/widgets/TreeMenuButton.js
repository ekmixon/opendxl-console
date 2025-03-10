/*

  SmartClient Ajax RIA system
  Version v11.1p_2018-06-28/LGPL Deployment (2018-06-28)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/
// Button which will create a hierarchical menu structure based on its own 
// data or dataSource property.
// Values can be selected in the menu and will be displayed in the button's title.
// Path to the selected value will also be hilited in the menu.


//> @class SelectionTreeMenu
// A simple subclass of +link{Menu} created by +link{TreeMenuButton}.
// Shows the selected node's path in a custom style.
// <P>
// <b>Important Note</b>: this class is not directly usable except for skinning and for
// subclassing when setting +link{treeMenuButton.treeMenuConstructor} on a +link{TreeMenuButton}.
// @inheritsFrom Menu
// @treeLocation Client Reference/Control
// @visibility external
//<
isc.ClassFactory.defineClass("SelectionTreeMenu", "Menu") 

isc.SelectionTreeMenu.addMethods({

    // On click fire the click handler on our button.
    itemClick : function (item) {  this.inheritedProperties.button._itemSelected(item); },

    // Show a custom base / over style for the selected record's path    
    
    getBaseStyle : function (record, rowNum, colNum) {
        var button = this.inheritedProperties.button;
        if (button._inSelectionPath(record)) return button.selectedBaseStyle;
        return this.Super("getBaseStyle", arguments);
    },
    
    // Override show() to ensure we show the updated selection path by resetting our
    // rows' styles
    show : function () {
        if (this.body) {
            for (var i = 0; i < this.getTotalRows(); i++) {
                this.body.setRowStyle(i);
            }
        }
        return this.Super("show", arguments);
    },
    
    getItemTitle : function (item, a,b,c,d) {
        // Specifying a display field on the button ensures it is used to display items' titles
        var button = this.inheritedProperties.button;
        if (button.displayField) {
            return item[button.displayField];
        }
        // Otherwise pick up the title field from the data-source as normal
        return this.invokeSuper(isc.SelectionTreeMenu, "getItemTitle", item, a,b,c,d);
    }
});


//> @class TreeMenuButton
//
//  Button used to display a hierarchical Menu group for representing / selecting tree data.
// <P>
// <i><b>Important Note:</b> this class should not be used directly - it is exposed purely for
// +link{group:i18nMessages, i18n reasons.}</i>
//
// @inheritsFrom MenuButton
// @see SelectionTreeMenu
// @treeLocation Client Reference/Control
// @visibility external
//<

// Used by the TreeMenuItem class.
// Supports selection: 
// - Displays the selected value as the button's title by default.
// - Hilites the path to the selected record in its menu

isc.ClassFactory.defineClass("TreeMenuButton", "MenuButton");

//> @class ITreeMenuButton
//
//  Button used to display a hierarchical Menu group for representing / selecting tree data.
//  This is derived from the +link{class:MenuButton} and is +link{class:StretchImgButton} based.
// <P>
// <i><b>Important Note:</b> this class should not be used directly - it is exposed purely for
// +link{group:i18nMessages, i18n reasons.}</i>
//
// @inheritsFrom TreeMenuButton
// @treeLocation Client Reference/Control
// @visibility external
//<

isc.ClassFactory.defineClass("ITreeMenuButton", "TreeMenuButton");

isc._treeMenuButtonProps = {

    //> @attr treeMenuButton.title (String : null : IRW)
    // Title for this button. If not specified, the selected value from the tree will
    // be displayed instead.
    // @visibility external
    //<
    title:null,

    //> @attr treeMenuButton.unselectedTitle (HTMLString : "Choose a value" : IRW)
    // If +link{treeMenuButton.title, title} is null, this value will be displayed as a title 
    // when the user has not selected any value from the hierachichal menu.
    // @visibility external
    // @group i18nMessages
    //<
    unselectedTitle:"Choose a value",

    //> @attr treeMenuButton.emptyMenuMessage (HTMLString : null : IRW)
    // If this button's menu (or any of its submenus) are empty, this property can be used
    // to specify the message to display (as a disabled item) in the empty menu.
    // @visibility external
    //<
    //emptyMenuMessage : null,

    //> @attr treeMenuButton.showPath (boolean : false : IRW)
    // If +link{treeMenuButton.title, title} is null, when the user selects an item, should we 
    // show the full path to the item, or just the item's title as the button's title?
    // @visibility external
    //<    
    showPath:false,

    //> @attr treeMenuButton.pathSeparatorString (HTMLString : "&nbsp;&gt;&nbsp;" : IRW)
    // If +link{treeMenuButton.showPath, showPath} is true, this property specifies what will 
    // appear between the folders in the selected value's path.
    // @visibility external
    //<
    pathSeparatorString : "&nbsp;&gt;&nbsp;",

    //> @attr treeMenuButton.selectedBaseStyle (CSSStyleName: "treeMenuSelected" : IRW)
    // Base style to apply to the selected path within the menu. (The "over" version of this
    // style should also be defined in the stylesheet applied to this widget).
    // @visibility external
    //<
    selectedBaseStyle : "treeMenuSelected",

    // The title is going to keep changing width, so allow overflow.
    overflow:isc.Canvas.VISIBLE,

    //> @attr treeMenuButton.loadDataOnDemand (boolean : null : IRW)
    // If this button is showing a databound treeMenu, this attribute dictates whether the data 
    // should be loaded on demand or upfront.  The default is to load on demand.
    //<
    //loadDataOnDemand : true,

    //> @attr treeMenuButton.dataProperties (Tree : null : IR)
    // For a <code>TreeMenuButton</code> that uses a DataSource, these properties will be passed to
    // the automatically-created ResultTree.  This can be used for various customizations such as
    // modifying the automatically-chosen +link{tree.parentIdField}.
    // @group databinding
    // @visibility external
    //<

    //> @attr treeMenuButton.treeMenuConstructor (SCClassName : "SelectionTreeMenu" : IR)
    // Widget class for the menu created by this button.  The default is 
    // +link{class:SelectionTreeMenu}.
    // @visibility external
    //<
    treeMenuConstructor: isc.SelectionTreeMenu,

    //> @attr treeMenuButton.treeMenu (AutoChild Menu : null : IR)
    // AutoChild menu displayed when the button is clicked.
    // @visibility external
    //<
    treeMenuDefaults: {
        height: 1
    },

    // METHODS:

    // The title of the button should reflect the selected value (if there is one)
    getTitle : function () {
        // Allow the developer to specify an explicit (static) title.
        if (this.title) return this.title;

        var selection = this.getSelectedItem();
        return this._getTitleForItem(selection);
    },

    _getTitleForItem : function (item) {
        if (item != null) {
            if (!this.showPath) {
                if (!isc.isA.Menu(this.treeMenu)) this._createMenu();
                return this.treeMenu.getItemTitle(item);
            } else {
                // calling getTree automatically creates this.menu
                var tree = this.getTree();
                var parents = tree.getParents(item),
                    titleArray = [];

                for (var i = parents.length-1; i >=0; i--) {
                    if (!tree.showRoot && i == parents.length -1) continue;
                    titleArray.add(this.treeMenu.getItemTitle(parents[i]));
                }
                titleArray.add(this.treeMenu.getItemTitle(item));
                return titleArray.join(this.pathSeparatorString);
            }
        } else {
            return this.unselectedTitle;
        }
    },

    // Override the method to actually create the treeMenu (called lazily when the treeMenu is to be 
    // shown for the first time).
    _createMenu : function (properties) {
        properties = isc.addProperties({},properties, {
                        
            // All the submenus should have a pointer back to this item.
            inheritedProperties: {
                button:this
            },
            submenuConstructor: this.treeMenuConstructor,

            // Don't want to have to set this property at the menu level.
            canSelectParentItems: this.canSelectParentItems,
            
            dataSource: this.dataSource,
            // If criteria are specified at the button level, pass these through to
            // the actual Menu
            criteria: this.criteria,
            
            data: this.data,

			// EDD
			dataProperties: this.dataProperties
    	});
        
        // If we have one, apply a custom message for empty submenus to the menu
        if (this.emptyMenuMessage) properties.emptyMessage = this.emptyMenuMessage;
        if (this.loadDataOnDemand != null) properties.loadDataOnDemand = this.loadDataOnDemand;
        
        this.treeMenu = this.createAutoChild("treeMenu", properties);
        // set this.menu (defined on the superclass) to the local treeMenu - allows the 
        // superclass to manage placement and destruction - don't call Super() here though.
        this.menu = this.treeMenu;

        this.observe(this.treeMenu, "treeDataLoaded", "observer._treeDataLoaded()");
    },

    // _treeDataLoaded. If our menu gets its data from a ResultTree, and loadDataOnDemand is
    // false (so all the data is loaded upfront), this method will be fired on initial load.
    _treeDataLoaded : function () {
        //!DONTCOMBINE
        if (this.treeDataLoaded) this.treeDataLoaded();
    },
    
    // getTree method to retrieve a pointer to our tree data object
    getTree : function () {
        if (!isc.isA.Menu(this.treeMenu)) this._createMenu();
        // Use this.treeMenu.treeData - this avoids us having to create our own ResultTree if
        // we are databound.
        return this.treeMenu._treeData;
        
    },
    
    // Helper to update the menu data at runtime
    setData : function (data) {
        this.data = data;
        if (this.treeMenu != null) {
            
            if (!isc.isA.Menu(this.treeMenu)) this._createMenu();
            this.treeMenu.setData(data);
        }
    },
    
    // On selection we want to:
    // - fire any developer specified handler
    // - change our title to display the selected item
    // - hilite the selection item path when the menu is visible
    _itemSelected : function (item) {
        //!DONTCOMBINE
        // If the developer's change handler returns false, cancel the selection.
        if (this.itemSelected && this.itemSelected(item, this._selectedItem) == false) 
            return;
            
        this.setSelectedItem(item);
    },
    
    setSelectedItem : function (item) {
        // We don't need a full selection object - simply hang onto the last clicked node.
        this._selectedItem = item;
        // setTitle will dynamically recalc the title and update
        // (Note that redraw() will not, if we're showing a label. Noted in StatefulCanvas).
        if (this.isDrawn()) this.setTitle();
    },
    
    // getSelectedItem() returns the selected item
    getSelectedItem : function () {
        return this._selectedItem;
    },

    // Is some node an ancestor of the current selection?
    // Used for hiliting the current selection in our menus.    
    _inSelectionPath : function (node) {
        var selection = this.getSelectedItem(),
            tree = this.getTree();

        while (selection) {
            if (node == selection) return true;
            selection = tree.getParent(selection);
        }
        
        return false;
    }
    
};

isc.TreeMenuButton.addProperties(isc._treeMenuButtonProps);
isc.ITreeMenuButton.addProperties(isc._treeMenuButtonProps);
    
    
isc.TreeMenuButton.registerStringMethods({
    // itemSelected - handler fired when the user changes the selection.
    itemSelected : "item, oldItem"
});

isc.ITreeMenuButton.registerStringMethods({
    // itemSelected - handler fired when the user changes the selection.
    itemSelected : "item, oldItem"
});


