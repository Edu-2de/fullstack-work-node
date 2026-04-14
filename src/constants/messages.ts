export const ValidationMessages = {
    REQUIRED: "Campo obrigatório",
    INVALID_EMAIL: "Formato de e-mail inválido",
    INVALID_UUID: "ID inválido",
    INVALID_ROLE: "Role inválido",
    EMPTY_REQUEST: "Nenhum dado foi fornecido",
    MIN_LENGTH: (min: number) => `O campo deve ter no mínimo ${min} caracteres`,
    MAX_LENGTH: (max: number) => `O campo deve ter no máximo ${max} caracteres`,
};

export const ErrorMessages = {
    NOT_FOUND: (resource: string) =>
        `${resource} não encontrado(a) no sistema.`,

    ALREADY_EXISTS: (resource: string) =>
        `Este(a) ${resource} já existe no sistema.`,

    IN_USE: (resource: string, dependencies: string) =>
        `Não é possível deletar este(a) ${resource} pois existem ${dependencies} associados a ele(a).`,

    UNAUTHORIZED: () => `Voce nao tem autorização para realizar essa ação `,
};

export const ValidMessages = {
    DELETED: (resource: string) => `${resource} deletado(a) com sucesso!`,
};
