import { RolesList } from './shared-constant';

export class SharedService {
    public static userHasOneOfRoles(user: { roles?: any[], rolesString?: string[] }, roles: string[], rolesFieldName = '') {
        if (!user)
            return false;
        if (!rolesFieldName)
            rolesFieldName = user.roles && !!user.roles.length ? 'roles' : 'rolesString';
        return user && (user as any)[rolesFieldName] && (user as any)[rolesFieldName].some((x: any) => roles.indexOf(x) !== -1);
    }

    public static userHasRole(user: { roles?: any[], rolesString?: string[] }, role: string, rolesFieldName = '') {
        return this.userHasOneOfRoles(user, [role], rolesFieldName);
    }

    public static userIsAdmin(user: { roles?: any[], rolesString?: string[] }) {
        return this.userHasRole(user, RolesList.Admin);
    }
}