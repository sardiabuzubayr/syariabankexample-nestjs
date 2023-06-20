import { Table, Model, Column, PrimaryKey, AutoIncrement } from "sequelize-typescript";

@Table
export class Roles extends Model{
    @Column({primaryKey:true})
    role_id:number
    @Column
    type:string    
}