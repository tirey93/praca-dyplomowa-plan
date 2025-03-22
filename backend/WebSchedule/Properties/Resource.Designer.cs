﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WebSchedule.Properties {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "17.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class Resource {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Resource() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("WebSchedule.Properties.Resource", typeof(Resource).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Bad Request: {0}.
        /// </summary>
        internal static string ControllerBadRequest {
            get {
                return ResourceManager.GetString("ControllerBadRequest", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Forbidden: {0}.
        /// </summary>
        internal static string ControllerForbidden {
            get {
                return ResourceManager.GetString("ControllerForbidden", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Internal Server Error: {0}.
        /// </summary>
        internal static string ControllerInternalError {
            get {
                return ResourceManager.GetString("ControllerInternalError", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Method Not Allowed: {0}.
        /// </summary>
        internal static string ControllerMethodNotAllowed {
            get {
                return ResourceManager.GetString("ControllerMethodNotAllowed", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Not Found: {0}.
        /// </summary>
        internal static string ControllerNotFound {
            get {
                return ResourceManager.GetString("ControllerNotFound", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Activity with ID {0} not found..
        /// </summary>
        internal static string ExceptionActivityNotFound {
            get {
                return ResourceManager.GetString("ExceptionActivityNotFound", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to User not found..
        /// </summary>
        internal static string ExceptionNoneUserNotFound {
            get {
                return ResourceManager.GetString("ExceptionNoneUserNotFound", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Reservation with ID {0} not found..
        /// </summary>
        internal static string ExceptionReservationNotFound {
            get {
                return ResourceManager.GetString("ExceptionReservationNotFound", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to JWT signing key is missing..
        /// </summary>
        internal static string ExceptionSigningKeyIsMissing {
            get {
                return ResourceManager.GetString("ExceptionSigningKeyIsMissing", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to User with name {0} already exists..
        /// </summary>
        internal static string ExceptionUserAlreadyExists {
            get {
                return ResourceManager.GetString("ExceptionUserAlreadyExists", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to User with ID {0} is blocked from making reservations..
        /// </summary>
        internal static string ExceptionUserHasReservationDisabled {
            get {
                return ResourceManager.GetString("ExceptionUserHasReservationDisabled", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to User with ID {0} is not active..
        /// </summary>
        internal static string ExceptionUserIsNotActive {
            get {
                return ResourceManager.GetString("ExceptionUserIsNotActive", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to User with ID {0} not found..
        /// </summary>
        internal static string ExceptionUserNotFound {
            get {
                return ResourceManager.GetString("ExceptionUserNotFound", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Password for user name {0} not match..
        /// </summary>
        internal static string ExceptionUserPasswordNotMatch {
            get {
                return ResourceManager.GetString("ExceptionUserPasswordNotMatch", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Login failed for user {0}..
        /// </summary>
        internal static string LoginFailedForUser {
            get {
                return ResourceManager.GetString("LoginFailedForUser", resourceCulture);
            }
        }
    }
}
