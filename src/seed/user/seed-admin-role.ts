import AppDbContext from "../../model/AppDbContext.js";

export default async function seedAdminRole(context: AppDbContext) {
    let role = await context.roleTypes.where({ roleName: "Administrator"}, (p) => (x) => x.roleName === p.roleName).first();
    if (!role) {
        role = context.roleTypes.add({roleName: "Administrator"});
        await context.saveChanges();
    }
    return role;
}