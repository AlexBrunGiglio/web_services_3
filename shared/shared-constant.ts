export enum RolesList {
    Admin = 'admin',
    Visitor = 'visitor',
}

export enum AppTypes {
    Gender = "Gender",
    PresenceStatut = "PresenceStatut"
}

export enum Gender {
    Male = "Gender_Male",
    Female = "Gender_Female",
}

export enum PresenceStatut {
    Online = 'PresenceStatut_Online',
    Missing = 'PresenceStatut_Missing',
    Busy = 'PresenceStatut_Busy',
    Offline = 'PresenceStatut_Offline,'
}
export enum AppResponseCode {
    ExpiredToken = 4031,
}
export const refreshTokenLsKey = 'template_refresh_token';
