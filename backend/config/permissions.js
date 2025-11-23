const permissionsConfig = {
    superadmin: {
        name: 'Super Administrador',
        description: 'Acesso total ao sistema',
        can: [
            'manage_users',
            'manage_permissions', 
            'manage_resources',
            'view_logs',
            'manage_backup',
            'delete_resources',
            'restore_resources'
        ]
    },
    moderador: {
        name: 'Moderador',
        description: 'Pode moderar conteúdo e usuários',
        can: [
            'manage_resources',
            'delete_resources',
            'restore_resources'
        ]
    },
    editor: {
        name: 'Editor',
        description: 'Pode criar e editar recursos',
        can: [
            'manage_resources'
        ]
    },
    usuario: {
        name: 'Usuário',
        description: 'Acesso básico ao sistema',
        can: []
    }
};

const can = (nivel, action) => {
    return permissionsConfig[nivel]?.can.includes(action) || false;
};

const getLevelInfo = (nivel) => {
    return permissionsConfig[nivel] || permissionsConfig.usuario;
};

module.exports = {
    permissionsConfig,
    can,
    getLevelInfo
};