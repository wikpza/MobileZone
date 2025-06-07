import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

// Единицы измерения
export class Unit extends Model {
        public id!: number;
        public name!: string;
}
Unit.init(
    {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: "unit" }
);

// Сырье
export class RawMaterial extends Model {
        public id!: number;
        public name!: string;
        public unitId!: number;
        public quantity!: number;
        public cost!: number;
}
RawMaterial.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        unitId: { type: DataTypes.INTEGER, references: { model: Unit, key: "id" } },
        quantity: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        cost: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },

    },
    { sequelize, modelName: "raw_material" }
);

// Готовая продукция
export class Product extends Model {
        public id!: number;
        public name!: string;
        public unitId!: number;
        public quantity!: number;
        public cost!: number;
}
Product.init(
    {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: { type: DataTypes.STRING, allowNull: false },
            unitId: { type: DataTypes.INTEGER, references: { model: Unit, key: "id" } },
            quantity: { type: DataTypes.FLOAT, allowNull: false, defaultValue:0 },
            cost: { type: DataTypes.FLOAT, allowNull: false, defaultValue:0 },
    },
    { sequelize, modelName: "product" }
);

// Должности
export class Position extends Model {
        public id!: number;
        public name!: string;
}
Position.init(
    {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            name: { type: DataTypes.STRING, allowNull: false, unique:true },
    },
    { sequelize, modelName: "position" }
);

// Сотрудники
export class Employee extends Model {
        public id!: number;

        public firstName!: string;
        public lastName!: string;
        public middleName!: string;

        public positionId?: number;
        public salary!: number;
        public address!: string;
        public phone!: string;

        public login!: string;
        public password!: string

}
Employee.init(
    {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            firstName: { type: DataTypes.STRING, allowNull: false },
            lastName: { type: DataTypes.STRING, allowNull: false },
            middleName: { type: DataTypes.STRING, allowNull: false },
            positionId: { type: DataTypes.INTEGER, references: { model: Position, key: "id" }, allowNull:false },
            salary: { type: DataTypes.FLOAT, allowNull: false },
            address: { type: DataTypes.STRING, allowNull: false },
            phone: { type: DataTypes.STRING, allowNull: false },
            login: {type:DataTypes.STRING, allowNull:false, unique:true},
            password:{type:DataTypes.STRING, allowNull:false,}

    },
    { sequelize, modelName: "employee" }
);

// Ингредиенты
export class Ingredient extends Model {
        public id!: number;
        public productId!: number;
        public rawMaterialId!: number;
        public quantity!: number;
}
Ingredient.init(
    {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            productId: { type: DataTypes.INTEGER, references: { model: Product, key: "id" } },
            rawMaterialId: { type: DataTypes.INTEGER, references: { model: RawMaterial, key: "id" } },
            quantity: { type: DataTypes.FLOAT, allowNull: false },
    },
    { sequelize, modelName: "ingredient" }
);

// Бюджет
export class Budget extends Model {
        public id!: number;
        public amount!: number;
        public markUp!: number;
        public bonus!: number;
        public employeeId!: number
}
Budget.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        amount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        bonus: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        markUp: {
            type: DataTypes.INTEGER,  // Целое число
            allowNull: false,
            defaultValue: 0, // Минимальное значение
            validate: {
                min: 0, // Должно быть больше 0
                isInt: true // Должно быть целым числом
            }
        },
        employeeId: { type: DataTypes.INTEGER, references: { model: Employee, key: "id" }, allowNull:true },
    },
    { sequelize, modelName: "budget" }
);
// История бюджета
export class BudgetHistory extends Model {
        public id!: number;
        public amount!: number;
        public type!: "expense" | "income";
        public employeeId!:number
}
BudgetHistory.init(
    {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            amount: { type: DataTypes.FLOAT, allowNull: false },
            type: { type: DataTypes.ENUM("expense", "income"), allowNull: false },
            employeeId: { type: DataTypes.INTEGER, references: { model: Employee, key: "id" }, allowNull:false },
    },
    { sequelize, modelName: "budget_history" }
);

// Закупка сырья
export class RawMaterialPurchase extends Model {
        public id!: number;
        public rawMaterialId!: number;
        public quantity!: number;
        public cost!: number;
        public employeeId!: number;
}
RawMaterialPurchase.init(
    {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            rawMaterialId: { type: DataTypes.INTEGER, references: { model: RawMaterial, key: "id" } },
            quantity: { type: DataTypes.FLOAT, allowNull: false, defaultValue:0 },
            cost: { type: DataTypes.FLOAT, allowNull: false },
            employeeId: { type: DataTypes.INTEGER, references: { model: Employee, key: "id" },  allowNull: false },
    },
    { sequelize, modelName: "raw_material_purchase" }
);

// Продажа продукции
export class ProductSale extends Model {
        public id!: number;
        public productId!: number;
        public quantity!: number;
        public cost!: number;
        public employeeId!: number;
}
ProductSale.init(
    {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            productId: { type: DataTypes.INTEGER, references: { model: Product, key: "id" } },
            quantity: { type: DataTypes.FLOAT, allowNull: false },
            cost: { type: DataTypes.FLOAT, allowNull: false },
            employeeId: { type: DataTypes.INTEGER, references: { model: Employee, key: "id" } },
    },
    { sequelize, modelName: "product_sale" }
);

// Производство продукции
export class ProductManufacturing extends Model {
        public id!: number;
        public productId!: number;
        public quantity!: number;
        public employeeId!: number;
}
ProductManufacturing.init(
    {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            productId: { type: DataTypes.INTEGER, references: { model: Product, key: "id" } },
            quantity: { type: DataTypes.FLOAT, allowNull: false },
            employeeId: { type: DataTypes.INTEGER, references: { model: Employee, key: "id" } },
    },
    { sequelize, modelName: "product_manufacturing" }
);

export class Permissions extends Model {
    public id!:number;
    public permission!:string;
    public description!: string;
    public permissionKey!:string;
}

Permissions.init(
    {
        id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        permission:{type: DataTypes.STRING, allowNull:false},
        description:{type:DataTypes.TEXT, allowNull:false},
        permissionKey:{type :DataTypes.STRING, allowNull:false, unique:true}

    },
    {sequelize, modelName: "permissions"}
)

export class PositionPermissions extends Model {
    public id!:number;
    public positionId!:number;
    public permissionId!:number;

}

PositionPermissions.init(
    {
        id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        positionId: { type: DataTypes.INTEGER, references: { model: Position, key: "id" } },
        permissionId: { type: DataTypes.INTEGER, references: { model: Permissions, key: "id" } },
    },
    {sequelize, modelName: "permission_access"}
)
export class Salary extends Model{
    public id!:number;
    public employeeId!:number;
    public numSoledProduct!:number;
    public numCreatedProduct!:number;
    public numBuyMaterial!:number;
    public totalAction!: number;
    public bonus!:number;
    public salary!:number;
    public totalSalary!:number;
    public isGiven!:boolean;
    public salaryDate:Date;

}

Salary.init({
    id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    employeeId: { type: DataTypes.INTEGER, references: { model: Employee, key: "id" } },
    numSoledProduct: { type: DataTypes.INTEGER, allowNull: false },
    numCreatedProduct: { type: DataTypes.INTEGER, allowNull: false },
    numBuyMaterial: { type: DataTypes.INTEGER, allowNull: false },
    totalAction: {type:DataTypes.INTEGER, allowNull:false},
    bonus: { type: DataTypes.FLOAT, allowNull: false },
    salary: { type: DataTypes.FLOAT, allowNull: false },
    totalSalary: { type: DataTypes.FLOAT, allowNull:false },
    isGiven:{type:DataTypes.BOOLEAN, defaultValue:false},
    salaryDate:{type:DataTypes.DATE, allowNull:false}
},
    {sequelize, modelName:"employeeSalary"})

export class Loan extends Model{
    public id!:number
    public loanSum!:number
    public procentStavka!:number
    public periodYear!:number
    public penyaStavka!:number
    public takeDate!:Date
    public statusFinished!:boolean
}
Loan.init({
    id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        loanSum: { type: DataTypes.FLOAT, allowNull: false },
    procentStavka: { type: DataTypes.FLOAT, allowNull: false },
        periodYear: { type: DataTypes.INTEGER, allowNull: false },
    penyaStavka: { type: DataTypes.FLOAT, allowNull: false },
        takeDate:{type:DataTypes.DATE, allowNull:false},
    statusFinished:{
        type:DataTypes.BOOLEAN, defaultValue:false
    }

},
    {sequelize, modelName:"loan"})


export class LoanPayment extends Model{
    public id!:number
    public loanId!:number
    public giveDate!:Date
    public mainLoan!:number
    public procentSumma!:number
    public penyaSumma!:number
    public OstatokDolga!:number
    public overdueDay!:number
}
LoanPayment.init({
        id: {type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
        loanId: { type: DataTypes.INTEGER, references: { model: Loan, key: "id" } },
        giveDate:{type:DataTypes.DATE, allowNull:false},
        mainLoan: { type: DataTypes.FLOAT, allowNull: false },
        procentSumma: { type: DataTypes.FLOAT, allowNull: false },
        penyaSumma: { type: DataTypes.FLOAT, allowNull: false },
        OstatokDolga: { type: DataTypes.FLOAT, allowNull: false },
        overdueDay: { type: DataTypes.INTEGER, defaultValue:0  },

    },
    {sequelize, modelName:"loan_payment"})

// Связи между моделями
Loan.hasMany(LoanPayment, {foreignKey:"loanId"})
Unit.hasMany(RawMaterial, { foreignKey: "unitId" });
Unit.hasMany(Product, { foreignKey: "unitId" });
Position.hasMany(Employee, { foreignKey: "positionId" });
Employee.hasOne(Salary, { foreignKey: "employeeId" });
Salary.belongsTo(Employee, { foreignKey: "employeeId" });

LoanPayment.belongsTo(Loan, {foreignKey:"loanId"})
Permissions.hasMany(PositionPermissions, {foreignKey:"permissionId"})
Position.hasMany(PositionPermissions, {foreignKey:"positionId"})
PositionPermissions.belongsTo(Permissions, {foreignKey:"permissionId"})
PositionPermissions.belongsTo(Position, {foreignKey:"positionId"})

Employee.hasMany(Budget, {foreignKey:"employeeId"})
Budget.belongsTo(Employee, {foreignKey:"employeeId"})

RawMaterial.belongsTo(Unit, { foreignKey: "unitId" });
Product.belongsTo(Unit, { foreignKey: "unitId" });
Employee.belongsTo(Position, { foreignKey: "positionId" });
Ingredient.belongsTo(Product, { foreignKey: "productId" });
Ingredient.belongsTo(RawMaterial, { foreignKey: "rawMaterialId" });
RawMaterialPurchase.belongsTo(RawMaterial, { foreignKey: "rawMaterialId" });
RawMaterialPurchase.belongsTo(Employee, { foreignKey: "employeeId" });
ProductSale.belongsTo(Product, { foreignKey: "productId" });
ProductSale.belongsTo(Employee, { foreignKey: "employeeId" });
ProductManufacturing.belongsTo(Product, { foreignKey: "productId" });
ProductManufacturing.belongsTo(Employee, { foreignKey: "employeeId" });

BudgetHistory.belongsTo(Employee, {foreignKey:"employeeId"})
// Обратные связи
RawMaterial.hasMany(RawMaterialPurchase, { foreignKey: "rawMaterialId" });
Employee.hasMany(RawMaterialPurchase, { foreignKey: "employeeId" });
Product.hasMany(ProductSale, { foreignKey: "productId" });
Employee.hasMany(ProductSale, { foreignKey: "employeeId" });
Product.hasMany(ProductManufacturing, { foreignKey: "productId" });
Employee.hasMany(ProductManufacturing, { foreignKey: "employeeId" });

Employee.hasMany(BudgetHistory, { foreignKey: "employeeId" });
