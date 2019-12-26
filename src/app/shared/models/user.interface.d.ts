export interface IUserMeta {

    // NOTE: decided not to flatten because this allows us to put
    // firebase rules on /profile and lock off other writable nodes 
    // about a user inline with profile, like duplicating permissions
    profile: {
        // email: string; // use firebase.auth.currentUser instead of duplicating email
    };

    permissions: IPermissions

}

// function triggers write to this database node in isolation 
export interface IPermissionsNode {
    [uid: string]: IPermissions
}

// defines permissions as super or on specific team
export interface IPermissions {
    // permissions for managing super administrator (ie: system admin)
    super?: IRoles

    // permissions for managing teams
    teams: {
        [teamId: string]: IRoles
    }
}

// progamatic role types
export interface IRoles {
    // structured with plural roles rather than a single role
    // so that we can scale out more permissions if needed
    roles: {
        admin?: boolean;
        manager?: boolean;
        read?: boolean;
    }
}
