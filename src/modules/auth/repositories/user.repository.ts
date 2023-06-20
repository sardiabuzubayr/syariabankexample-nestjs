import { Inject, Injectable } from "@nestjs/common";
import { Users } from "../models/user.model";
import { Op } from "sequelize";
import { CommonData } from "src/modules/common.data";
import { Roles } from "../models/role.model";

@Injectable()
export class UserRepository {
    constructor(@Inject('UserModel') private readonly userModel: typeof Users){
    }

    async getAll(keywords: string, filters: [], limit: number, offset: number): Promise<CommonData> {
        let total = await this.userModel.count({
            where:{
                username:{
                    [Op.like]:`%${keywords}%`
                }
            }
        })

        let data = await this.userModel.findAll({
            attributes:['user_id', 'name', 'username', 'phone', 'address'],
            where:{
                [Op.or]:[
                    {username:{[Op.like]:`%${keywords}%`}},
                    {name:{[Op.like]:`%${keywords}%`}},
                    // {'Roles.type':{[Op.like]:`%${keywords}%`}},
                ],
            },
            include:[
                {
                    model:Roles,
                    attributes:['role_id', 'type'],
                    required:true
                }
            ],
            limit:parseInt(limit+""),
            offset:offset,
        });

        let common = new CommonData(total, data)
        return common;
    }

    async getOneByUserId(userId:number):Promise<Users>{
        return await this.userModel.findByPk(userId)
    }

    async getOneByUsername(username:string):Promise<Users>{
        return await this.userModel.findOne({where:{
            username:{
                [Op.eq]:username
            }
        }})
    }
}