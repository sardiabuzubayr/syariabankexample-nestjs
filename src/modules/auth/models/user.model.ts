import { Table, Model, Column, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Roles } from "./role.model";

@Table({tableName:'users'})
export class Users extends Model{
    @Column({primaryKey:true, autoIncrement:true})
    user_id:number
    @Column
    name:string
    @Column
    username:string
    @Column
    password:string
    @Column
    phone:string
    @Column
    address:string
    @ForeignKey(() => Roles)
    @Column
    role_id: number;
    @BelongsTo(()=>Roles)
    roles:number
}