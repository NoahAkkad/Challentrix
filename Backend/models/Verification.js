module.exports = (sequelize , DataTypes) => {
    const Verification = sequelize.define('Verification', {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id',
            },
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },{
        tableName: 'Verify', 
        timestamps: true
    })
    return Verification
}