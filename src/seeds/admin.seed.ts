import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/user";

async function createAdmin() {
    await AppDataSource.initialize();
    console.log("Conexão estabelecida para o Seed!");

    try {
        const passwordAdmin = process.env.ADMIN_PASSWORD as string;
        const emailAdmin = process.env.ADMIN_EMAIL as string;

        const userRepository = AppDataSource.getRepository(User);

        const adminEmail = emailAdmin;
        const existEmail = await userRepository.existsBy({
            email: adminEmail,
        });
        if (existEmail) {
            console.log("Admin já existe!");
            return;
        }
        const password = await bcrypt.hash(passwordAdmin, 10);

        const adminUser = userRepository.create({
            name: "admin",
            email: adminEmail,
            password_encrypted: password,
            role: UserRole.ADMIN,
        });
        await userRepository.save(adminUser);
        console.log("✅ Administrador criado com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar admin: ", error);
    } finally {
        await AppDataSource.destroy();
    }
}

createAdmin();
