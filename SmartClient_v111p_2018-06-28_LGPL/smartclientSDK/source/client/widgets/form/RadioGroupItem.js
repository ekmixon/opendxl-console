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
//>	@class	RadioGroupItem
// FormItem that shows a set of mutually exclusive options as a group of radio buttons.
// @inheritsFrom FormItem
// @visibility external
//<
isc.ClassFactory.defineClass("RadioGroupItem", "ContainerItem");
isc.RadioGroupItem.addProperties({

    //>	@attr	radioGroupItem.itemHeight		(number : 20 : IRW)
	//			default height of EACH item
	//		@group	appearance
	//<
	itemHeight:20,

    //>	@attr	radioGroupItem.vertical			(Boolean : true : IRW)
	//			True == display options vertically, false == display in a single row
	//		@group	appearance
    // @visibility external
	//<
	vertical:true,
    
    //> @attr radioGroupItem.fillHorizontalSpace (boolean : false : IRW)
    // If +link{radioGroupitem.vertical} is false, and this item has a specified width, should
    // options be spread out evenly to fill the specified width?
    // @group appearance
    // @visibility external
    //<
    fillHorizontalSpace:false,

    //> @attr radioGroupItem.prompt (HTMLString : null : IRW)
	// Don't have a prompt for the entire item -- use itemPrompt to set the prompt of each
    // individual button.
	//		@group	appearance
	//<
	prompt:null,

    //> @attr radioGroupItem.itemPrompt (HTMLString : null : IRW)
	// Mouse-over prompt for the label of this item.  Use character <code>"*"</code>
    // to substitute in the item value. For example <code>"Select value *"</code> would 
    // show the prompt <b>"Select value a"</b> when a user hovered over a radio button for
    // the value <code>"a"</code>.
	//		@group	appearance
	//<
	//itemPrompt:null

    //> @attr radioGroupItem.textBoxStyle (FormItemBaseStyle : "labelAnchor" : IRW)
    // Base CSS class applied to the text for items within this radio group.
    // @group appearance
    // @visibility external
    //<
    textBoxStyle:"labelAnchor",

    //>	@attr	radioGroupItem.wrap (boolean : null : IRW)
	// Should the text for items within this radio group wrap?
	// @group appearance
    // @visibility external
	//<

	// Don't write out the <label for...> tag around the title of a radioGroup as a whole
	// - we'll write it out around the individual radio-items' titles. Writing it out for
	// the group-title as a whole gives the odd effect of making this title the tab-stop
	// for the item in IE.
	writeOutLabelTag:false,

    // By default (true) native radio items are used within the group.
    // Can be disabled by a skin to render radio items using CheckboxItem.
    // Mutual exclusion is also performed internally because the browser
    // will not be doing it.
    useNativeRadioItems:true,

    // Checkbox configuration when not using RadioItems
    checkboxItemDefaults: {
        type:"checkbox",
        showLabel:true,

        showValueIconDown:false,
        showValueIconDisabled:true,
        showValueIconOver:true,
        showValueIconFocused:true,

        checkedImage: "sprite:cssClass:radioTrue;size:25,25",
        uncheckedImage: "sprite:cssClass:radioFalse;size:25,25",
        unsetImage: "sprite:cssClass:radioFalse;size:25,25",

        // prevent unchecking a value
        change : function (form, item, value, oldValue) {
            if (oldValue) return false;
        },
        // report change to update group value and uncheck old value
        changed : function (form, item, value) {
            // pass in this.value (not this.getValue() which could be null)
            this.parentItem.checkboxChanged(this.value);
        }
    }

});

isc.RadioGroupItem.addMethods({

    init : function () {
        // handle init-time only 'disabledValues' flag
        if (this.disabledValues != null) {
            this._disabledValues = {};
            for (var i = 0; i < this.disabledValues.length; i++) {
                var value = this.disabledValues[i];
                this._disabledValues[value] = true;
            }
        }
        return this.Super("init", arguments);
    },

    //> @method radioGroupItem.setTextBoxStyle()
    // Setter for +link{attr:textBoxStyle}.
    // @param newTextBoxStyle (FormItemBaseStyle) new <code>textBoxStyle</code>.
    // @visibility external
    //<
    setTextBoxStyle : function (newTextBoxStyle) {
        this.textBoxStyle = newTextBoxStyle;

        var items = this.items;
        if (items != null) {
            for (var i = 0, numItems = items.length; i < numItems; ++i) {
                var item = items[i];
                
                var previousItemTextBoxStyle = item.textBoxStyle;
                item.textBoxStyle = newTextBoxStyle;
                // Make sure that the item's textBoxStyle was changed before calling the
                // potentially expensive updateState() method.
                if (previousItemTextBoxStyle != newTextBoxStyle) item.updateState();
            }
        }
    },

    //> @method radioGroupItem.pendingStatusChanged()
    // Notification method called when +link{FormItem.showPending,showPending} is enabled and
    // this radio group should either clear or show its pending visual state.
    // <p>
    // The default behavior is that the +link{FormItem.titleStyle,titleStyle} and
    // +link{FormItem.cellStyle,cellStyle} are updated to include/exclude the "Pending" suffix.
    // In addition, the label for the newly-selected option will have a different color.
    // Returning <code>false</code> will cancel this default behavior.
    // @include FormItem.pendingStatusChanged()
    //<
    _updatePendingStatuses : function () {
        var pendingStatus = this._getShowPending() && this.pendingStatus;
        var currentItem = this.itemForValue(this._value);
        if (currentItem != null) {
            currentItem.setFixedPendingStatus(pendingStatus);
        }
    },

    // Override _useHiddenDataElement to return false
    // we're not marked as having a data element (hasDataElement() == false) but our sub elements
    // do have live HTML data elements, so on form submission we don't need to write out a
    // hidden data element.
    _useHiddenDataElement : function () {
        return false;
    },

    //> @method radioGroupItem.valueHoverHTML() (A)
    // If defined, this method should return the HTML to display in a hover canvas when the 
    // user holds the mousepointer over one of the radio-items in this RadioGroupItem.  Return 
    // null to suppress the hover canvas altogether.
    //
    // @param value (Any) The sub-value (radio-item) to get the hoverHTML for
    // @param item (RadioGroupItem) Pointer to this item
    // @param form (DynamicForm)  This item's form
    // @return (HTMLString) HTML to be displayed in the hover
    // @group Hovers
    // @visibility external    
    //<

    

	//>	@method	radioGroupItem.setItems()	(A)
	// Override setItems() to create radio buttons for each item in our valueMap.
	// We store items we've already created in a cache so we don't create them over and
    // over redundantly.
	//
	//		@group	drawing
	//
	//		@param	value	(String)	Value of the element [Unused because it is more reliably set by setValue].
	//		@return	(HTMLString)	HTML output for this element
	//<
    // Note: If the developer were to specify more than one item in the valueMap with the same
    // title/value, we would get in trouble here, as we'd end up with more than one entry in
    // our items array pointing to the same form item - This is an invalid usage by the
    // developer, but we don't currently catch this case explicitly.
	setItems : function () {
        var isBoolean = isc.SimpleType.inheritsFrom(this.getType(), "boolean");
        if (isBoolean) this.initBooleanValueMap();

		var valueMap = this.getValueMap();
		if (!this.itemCache) this.itemCache = {};
		
		// create an array to hold the new set of items
		var items = [];
        
		if (isc.isAn.Array(valueMap)) {
			for (var i = 0; i < valueMap.length; i++) {
				var value = valueMap[i];
                
				items.add(this._getRadioItem(value, value));
			}
		} else {
            var keys = isc.getKeys(valueMap);
            for (var i=0; i<keys.length; i++) {
                var value = keys[i];
                var title = valueMap[value];
                
                if (isBoolean && !isc.isA.Boolean(value)) {
                    if (isc.isA.String(value)) value = value.toLowerCase();
                    if (value == "false") value = false;
                    else if (value == "true") value = true;
                    else if (keys.length == 2) value = (i==0);
                }

				items.add(this._getRadioItem(title, value));
			}
		}
		// call the superclass method to actually create the items
		return this.Super("setItems", [items]);
	},
    
	//> @method radioGroupItem._getRadioItem() (A)
	// Internal method to create radio item instances based on the title/value passed in.
	//
	// @param title (String) Title to display next to the radio item
    // @param value (Any) value the radio item represents.
	// @return (RadioItem) RadioItem instance to plug into the items array.
	// @group drawing
	//<
    _getRadioItem : function (title, value) {
        var pendingStatus = (this._getShowPending() && this.pendingStatus);

        var item = this.itemCache[value+"|"+title];
        // If we're reusing an item, clean off the old properties from when it was last used
        // such as _value / hasFocus
        
        if (item) {
            var itemValue = item._value;
            
            if (isc.isA.String(value)) itemValue += "";

            if (value != itemValue) {
                delete item._value;
                delete item._hadFocusBeforeRedraw;
            }
            delete item.hasFocus;
            delete item.disabled;

            item.setFixedPendingStatus(pendingStatus && value == this._value);

        } else {

            var prompt;
            if (this.itemPrompt) {
                var starRE = new RegExp("\\*","g");
                prompt = this.itemPrompt.replace(starRE, title);
            }
            var itemObj = {
                // ContainerItem stores sub-items under subItem.name.  Give the RadioItems names
                // that won't collide with other properties, but that we can look up by value.
                name: "_radioItem" + value,
                _autoAssignedName: true,

                value: value,

                // override getElementName - the 'name' written into the HTML element
                // must be the same for all these elements to create a radiogroup.
                getElementName : function () {
                    return this.parentItem.getElementName();
                },
                
                title: title, 
                prompt: prompt, 
                height: this.itemHeight, 
                _startRow: this.vertical, 

                // apply styling down to the items
                fixedPendingStatus: pendingStatus && value == this._value,
                textBoxStyle: this.textBoxStyle,
                wrap: this.wrap,

                setDisabled : function (disabled) {
                    this.parentItem._itemDisabled(this.value, disabled);
                    return this.Super("setDisabled", arguments);
                },
                
                shouldSaveValue: false,
                
                // don't allow changed events from sub-items to fire on the form
                suppressItemChanged: true
            };

            if (this.useNativeRadioItems) {
                isc.addProperties(itemObj, {
                    type:"radio",
                    
                    updateValue : function () {
                        // pass in this.value (not this.getValue() which could be null)
                        this.parentItem.updatePreviousSelection(this.value);
                        return this.Super("updateValue", arguments);
                    }
                });
            } else {
                isc.addProperties(itemObj, this.checkboxItemDefaults, this.checkboxItemProperties);
            }

            // support arbitrary modification of the item via an auto-child like properties block
            isc.addProperties(itemObj, this.itemProperties);
            
            var _this = this;

            if (!itemObj.itemHoverHTML && this.valueHoverHTML) {
                itemObj.itemHoverHTML = function () {
                    return _this.valueHoverHTML(value, _this, _this.form);
                }
            }
            
            itemObj.form = this.form;

            item = this.itemCache[value+"|"+title] = isc.FormItemFactory.makeItem(itemObj);
        }
        // The RadioGroup manages the disabled status of individual sub-items based on their
        // value.
        // Apply the appropriate disabled status to the item in question.
        
        if (this._disabledValues != null && this._disabledValues[value] != null) {
            item.disabled = this._disabledValues[value];
        }
        return item;
    },
    
    //>@attr RadioGroupItem.itemProperties (RadioItem Properties : null : IR)
    // Map of properties to apply to generated items within this RadioGroup. This allows you to 
    // customize the generated radio items for this item.
    // @visibility external
    //<
    // No need for a defaults block - the developer can just update the RadioItem class
    
    
    // getItemValue is used when generating member item HTML
    
    getItemValue : function (item) {
        var itemVal = item.value;
        if (itemVal == this.getValue()) return itemVal;
        return item.unselectedValue;
    },

    itemForValue : function (value) {
        return this["_radioItem" + value];
    },

    //> @attr radioGroupItem.disabledValues (Array of String : null : I)
    // This property allows you to specify an initial set of disabled options within
    // this radioGroup. Once the RadioGroupItem has been created +link{setValueDisabled()}
    // should be used to enable and disable options.
    // @visibility external
    //<
    
    //> @method radioGroupItem.setValueDisabled()
    // Disable or Enable a specific option within this radioGroup
    // @param value (Any) value of option to disable
    // @param disabled (boolean) true to disable the option, false to enable it
    // @visibility external
    //<
    setValueDisabled : function (value, disabled) {
        if (this._disabledValues != null && this._disabledValues[value] == disabled) return;
        var item = this.itemForValue(value);
        if (item && this.items.contains(item)) {
            // call 'setDisabled' on the item directly.
            // This is overridden to update our "disabled values" object
            item.setDisabled(disabled);
        // Support changing the disabled status for a value even if it
        // doesn't have an associated item. This actually means you can disable a value
        // that isn't necessarily in the valueMap - and if the valueMap is updated to
        // include it the item in question will show up disabled.
        } else {
            this._itemDisabled(value, disabled);
        }
    },
    
    _itemDisabled : function (value, disabled) {
        if (this._disabledValues == null) this._disabledValues = {};
        this._disabledValues[value] = disabled;
    },

    // Override ContainerItem.getTitleHTML().
    getTitleHTML : function () {
        // We need something with an ID to set the 'aria-labelledby' attribute to.
        
        var title = this.getTitle();
        return isc.SB.concat("<label id=", this._getLabelElementID(), ">", title, "</label>");
    },

	//>	@method	radioGroupItem.getInnerHTML()	(A)
	//		@group	drawing
	//			output the HTML for this element
	//
	//		@param	value	(String)	Value of the element [Unused because it is more reliably set by setValue].
	//		@return	(HTMLString)	HTML output for this element
	//<
	getInnerHTML : function (value) {        
		// always call setItems() since the valueMap may have changed!
        this.setItems();
		return this.Super("getInnerHTML", arguments);
	},
    
    _writeWidthAttribute : function () {
        if (this.writeWidthAttribute) return true;
        return this.fillHorizontalSpace;
    },
    _writeSizingDiv : function () {
        return !this._writeWidthAttribute();
    },

    
    // Override isEditable to indicate that the user can directly update the radioGroup's value
    isEditable : function () {
        return true;
    },

    //> @method radioGroupItem.setElementReadOnly()
    // Change the read-only state of the form element immediately.
    //<
    setElementReadOnly : function (readOnly) {
        // There is no element to mark read-only but we don't want the entire radio group
        // to be redrawn so we handle this method and do nothing. The radio items will be
        // updated individually.
    },

    initBooleanValueMap : function () {
        // if this item is boolean and has a two-item array as a valueMap, substitute it 
        // for an object valueMap with keys "true" and "false"
        var isBoolean = isc.SimpleType.inheritsFrom(this.getType(), "boolean");
        if (isBoolean && isc.isAn.Array(this.valueMap) && this.valueMap.length == 2) {
            this.valueMap = { "true": this.valueMap[0], "false": this.valueMap[1] };
        }
    },

     //> @method radioGroupItem.setValue()
    //      Set the value of this radiogroup item.
	//
    //      @group formValues
    //      @param  newValue    (Any)           value to set the item to
	//<
    setValue : function (newValue) {
        this._setValueCalled = true;

        var invalidValue = (this.valueMap == null) ||
            (isc.isAn.Array(this.valueMap) ? !this.valueMap.contains(newValue)
                                            : !isc.propertyDefined(this.valueMap, newValue));


        // use the default value if passed null, or a value for which we don't have a sub-item
        if (newValue == null || invalidValue) {
            newValue = this.getDefaultValue();
        }
        // "check" the appropriate sub item. 
        // If there is none, uncheck whatever is currently selected.  
        // Notes:
        // - We performed this check above to determine whether we need to apply a default
        //   value.  We still need to check again as we may not have a default value (or our
        //   default value could conceivably not be included in our valueMap).
        // - Clearing out our value if we don't find the value passed in means the user setting 
        //   the value of a radio-group to anything not in the valueMap is an equivalent to
        //   setting the value to null.
        if (this.items != null) {
            var newItem = this.itemForValue(newValue);
            if (newItem != null) {
                this.itemForValue(newValue).setValue(newValue);
                newItem.setFixedPendingStatus(this._getShowPending() && this.pendingStatus);
            }

            // if the previous value is not null, clear out the prev item's value
            // This serves 2 purposes:
            // - if we're clearing the value for this item, it's required to update the
            //   currently selected item on the page
            // - otherwise the currently selected item will already have been cleared, but
            //   we still want to clear out its _value property.
            var prevItem;
            if (this._value != null && this._value != newValue) {
                prevItem = this.itemForValue(this._value);
            } else if (this._changingValue) {
                prevItem = this.itemForValue(this._changeValue);
            }
            if (prevItem != null) {
                prevItem.setValue(null);
                prevItem.setFixedPendingStatus(false);
            }
        }

        // save the new value        
        this.saveValue(newValue);
    },

    // this function is fired as a result of a selection change in the radioGroup
    // Its purpose is to ensure that the item that was previously selected has its internal
    // _value updated to match the fact that it has been deselected.
    // We have to do this because when a radio item gets selected, it fires a change handler
    // for itself, but no change handler is fired for the previous selection which gets 
    // automatically deselected due to native mutex behavior
    // This function updates the deselected item to ensure that a getValue() call for it returns
    // the appropriate value (null)
    updatePreviousSelection : function (newValue) {
        var newItem = this.itemForValue(newValue);
        
        newItem.setFixedPendingStatus(this._getShowPending() && this.pendingStatus);

        // Bail if 'updateValue' is fired on the currently selected item.
        // This avoids an infinite loop whereby 
        //  "A" is initially selected
        //  User selects "B"
        //  'updateValue' on "B" fires 'updatePreviousSelection' on the group item
        //  updatePreviousSelection on the group item fires 'updateValue' on "A"
        //  'updateValue' on "A" fires 'updatePreviousSelection' on the group item
        // -- we stop the process there

        
        var currentValue = this.getValue();
        if (isc.isA.String(newValue)) currentValue += "";

        var previousItem;
        if (currentValue == null || newValue == currentValue || 
            (previousItem = this.itemForValue(currentValue)) == null)
        {
            return;
        }

        
        if (!this.useNativeRadioItems) {
            previousItem.setValue(null);
        } else {
            previousItem.updateValue();
        }

        previousItem.setFixedPendingStatus(false);
    },

    // override updateValue to get the value from the items
    // NOTE: We're currently relying on the fact that 'elementChanged()' will be bubbled and the
    // default implementation of this internal handler will fire updateValue() on a form item.
    // We may want to prevent elementChanged from bubbling, since Form Items should be managing
    // their own elements completely opaquely.  If so we would want to write change handlers
    // onto the sub-items to fire this.parentItem.updateValue().
    updateValue : function () {
        var value;
        // Any non-selected radioItem will return "null" from getValue();
        for (var i = 0; i < this.items.length; i++) {
            value = this.items[i].getValue();
            if (value != null) {
                break;
            }
        }

        // bail if the value is unchanged
        if (value == this._value) return;

        // fire the change handler, and bail if the change failed validation, etc.
        // Note: this method will call 'setValue()' to reset to the old value, or any value
        // suggested by the validators
        if (this.handleChange(value, this._value) == false) {
            return;
        }
        // check for updates performed by the change handler.
        value = this._changeValue;

        // save the value
        this.saveValue(value);

        // fire any specifed 'changed' handler for this item.
        this.handleChanged(value);
    },

    // Used when not using RadioItems
    checkboxChanged : function (newValue) {
        // fire the change handler, and bail if the change failed validation, etc.
        // Note: this method will call 'setValue()' to reset to the old value, or any value
        // suggested by the validators
        if (this.handleChange(newValue, this._value) == false) {
            return;
        }

        this.updatePreviousSelection(newValue);

        // save the value
        this.saveValue(newValue);

        // fire any specifed 'changed' handler for this item.
        this.handleChanged(newValue);
    },

	//>	@method	radioGroupItem.setValueMap
	//  Override setValueMap to redraw the form with the new set of radio items
	//<
    // A better way to do this would be to replace just the inner HTML for the relevant cell in
    // the dynamicForm, but currently we have no way to do that.
	setValueMap : function (valueMap) {
		this.Super("setValueMap", arguments);
		// unfortunately, there is no way to just update these values
		//  so we have to tell the item to redraw (will redraw the form by default)
		this.redraw();	
	},
	
	//>	@method	radioGroupItem.getHeight()	(A)
	//		@group	sizing
	//			output the height for this element
	//
	//		@return	(number)	height of the form element
	//<
    getHeight : function () {
        var cellPadding = isc.isA.Number(this.cellPadding) ? this.cellPadding : 0;
        if(!this.vertical) return this.itemHeight + cellPadding * 2;
        var valueMap = this.getValueMap(),
            numItems = 0;

        // if valueMap is an array, number of items is just the length of the array
        if (isc.isAn.Array(valueMap)) {
            numItems = valueMap.length;
        } else {
            for (var key in valueMap) {
                numItems++;
            }
        }
        return numItems * (this.itemHeight + cellPadding * 2);
    },
    
    // Override shouldStopKeypressBubbling to always stop bubbling on arrow keys
    
    _arrowKeys:{
        Arrow_Left:true, Arrow_Right:true,
        Arrow_Up:true, Arrow_Down:true
    },
    shouldStopKeyPressBubbling : function (keyName, characterValue) {
        if (this._arrowKeys[keyName]) return true;
        return this.Super("shouldStopKeyPressBubbling", arguments);
    }

});
