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
// Class will not work without the ListGrid
if (isc.ListGrid) {





//>	@class	DateTimeItem
//
// Subclass of DateItem for manipulating +link{type:FieldType,datetimes}.
//
// @inheritsFrom DateItem
// @visibility external
//<
// Note: This edits 'datetime' type fields, not 'dateTime' type fields, we should possibly rename
// to DatetimeItem.
isc.defineClass("DateTimeItem", "DateItem");


isc.DateTimeItem.addProperties({
    //>	@attr dateTimeItem.useTextField   (Boolean : true : R)
    // DateTimeItems show datetime values in a freeform text entry area.
    // @group basics
    // @visibility external
    //<
    useTextField:true,

    //> @attr dateTimeItem.browserInputType (String : null : IRA)
    // If +link{DateTimeItem.useTextField,useTextField} is true and browserInputType is set to
    // "datetime", then a native +externalLink{http://www.w3.org/TR/html5/forms.html#local-date-and-time-state-(type=datetime-local),HTML5 local datetime input}
    // is used in place of a text input.
    // <p>
    // The use of a native HTML5 datetime input causes certain features to be disabled. Input masks,
    // the picker icon, and a custom +link{DynamicForm.datetimeFormatter,datetimeFormatter} are not supported.
    // In-field hints are currently supported in Chrome/Chromium/Opera 15 and iOS 5.0+, but future browser
    // changes might force this support to be removed. Therefore, it is safest to <em>not</em>
    // use in-field hints (set showHintInField to false) in conjunction with a native HTML5 datetime
    // input. In-field hints are not supported in Opera 12 when using a native HTML5 datetime
    // input. If in-field hints are not supported in the browser, then showHintInField has no
    // effect and any hint will be shown to the side of the input.
    // <p>
    // <b>NOTES:</b>
    // <ul>
    //   <li>This feature requires specific CSS changes. Currently these changes have been made
    //       to the Enterprise, EnterpriseBlue, and Graphite skins only.</li>
    //   <li>In Chrome/Chromium/Opera 15 and Opera 12, native datetime inputs need to be made
    //       wider in order to fit the full datetime value within the native control. However,
    //       on iOS 5.0+, the normal width is fine. Be sure to test the layout of the form in
    //       all browsers that you wish to support.</li>
    // </ul>
    //
    // @visibility external
    //<

    //>	@attr	dateTimeItem.displayFormat  (DateDisplayFormat : null : IRW)
    // This property can be used to customize the format in which datetimes are displayed.<br>
    // Should be set to a standard +link{type:DateDisplayFormat} or
    // a function which will return a formatted date time string.
    // <P>
    // If unset, the standard shortDateTime format as set up in 
    // +link{DateUtil.setShortDatetimeDisplayFormat()} will be used.
    // <P>
    // <B>NOTE: you may need to update the +link{DateTimeItem.inputFormat, inputFormat}
    // to ensure the DateItem is able to parse user-entered date strings back into Dates</B>
    // @see dateTimeItem.inputFormat
    // @visibility external
    //<

    // set the undocumented showTime flag so we use 'toShortDatetime' rather than 'toShortDate'
    // when formatting our dates by default. Can be overridden via a custom formatter of course.
    showTime: true,

    // set the default data type to "datetime" because this is a DateTimeItem - otherwise, by
    // default, the time portion can't be edited in a non-databound item (it reverts to noon, 
    // our logicalDate marker, on loss of focus)
    defaultType: "datetime",

    //> @attr  dateTimeItem.inputFormat  (DateInputFormat : null : IRW)
    // @include dateItem.inputFormat
    // @visibility external
    //<
    
    // override shouldShowPickerTimeItem to force the picker to show the time even
    // if "type" isn't explicitly set to "datetime"
    shouldShowPickerTimeItem : function () {
        return this.showPickerTimeItem;
    }

});


} // end of if (isc.ListGrid)
