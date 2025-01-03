module.exports = (sequelize , DataTypes) => {
    const Category = sequelize.define('Category', {
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },{
        tableName: 'Category', 
        timestamps: true
    })
    return Category
}