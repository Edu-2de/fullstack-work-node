import EmailIcon from "../assets/icons/Envelope-Regular.svg?react";
import PasswordIcon from "../assets/icons/Password-Regular.svg?react";
import UserIcon from "../assets/icons/User-Regular.svg?react";
import Image from "../assets/images/Image.png";
import Button from "../components/button";
import InputText from "../components/input-text";
import MenuItem from "../components/menu-item";
import Text from "../components/text";

export default function PageRegister() {
    return (
        <div className="flex w-full h-screen bg-gray-100 overflow-hidden">
            <div className="hidden lg:flex w-1/2 p-5">
                <div className="relative w-full h-full rounded-4xl overflow-hidden">
                    <img
                        src={Image}
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-gray-100 via-gray-100/20 to-transparent z-10"></div>

                    <div className="absolute top-10 left-10 z-20 flex items-center">
                        <div className="w-6 h-8 bg-purple-light rounded-full opacity-90"></div>
                        <div className="w-8 h-8 bg-purple-base rounded-full -ml-2"></div>
                    </div>

                    <div className="absolute bottom-12 left-10 z-20 flex flex-col gap-3">
                        <Text
                            variant="text-md"
                            weight="bold"
                            className="text-white/80 lowercase tracking-wider"
                        >
                            ab filmes
                        </Text>
                        <Text
                            variant="display-md"
                            className="text-white leading-tight max-w-95"
                        >
                            O guia definitivo para os amantes do cinema
                        </Text>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-95 flex flex-col">
                    <div className="flex justify-center w-full mb-16">
                        <ul className="flex w-[320px] bg-gray-200 p-1.5 rounded-xl [&>li]:flex-1">
                            <MenuItem className="w-full" size="sm" to="/login">
                                Login
                            </MenuItem>
                            <MenuItem
                                className="w-full"
                                size="sm"
                                to="/registrar"
                            >
                                Cadastro
                            </MenuItem>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-8">
                        <Text
                            as="h1"
                            variant="display-xl"
                            className="text-white"
                        >
                            Crie sua conta
                        </Text>

                        <div className="flex flex-col gap-4">
                            <InputText
                                icon={UserIcon}
                                placeholder="Nome"
                                type="text"
                            />
                            <InputText
                                icon={EmailIcon}
                                placeholder="E-mail"
                                type="email"
                            />
                            <InputText
                                icon={PasswordIcon}
                                placeholder="Senha"
                                type="password"
                            />
                        </div>

                        <Button size="full" className="mt-2 h-12">
                            Criar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
