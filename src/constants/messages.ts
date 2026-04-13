export const ValidationMessages = {
    REQUIRED: "Campo obrigatório",
    INVALID_EMAIL: "Formato de e-mail inválido",
    INVALID_UUID: "ID inválido",
    INVALID_ROLE: "Role inválido",
    MIN_LENGTH: (min: number) => `O campo deve ter no mínimo ${min} caracteres`,
    MAX_LENGTH: (max: number) => `O campo deve ter no máximo ${max} caracteres`,
};

export const ErrorMessages = {
    USER_NOT_FOUND: "Usuário não encontrado no sistema",
    EMAIL_ALREADY_IN_USE: "Este email já está em uso!",
    CATEGORY_ALREADY_EXISTS: "Esta categoria já existe",
};
