import { tv } from "tailwind-variants";
import EmailIcon from "../assets/icons/Envelope-Regular.svg?react";
import PasswordIcon from "../assets/icons/Password-Regular.svg?react";
import Image from "../assets/images/Image.png";
import Button from "../components/button";
import InputText from "../components/input-text";
import MenuItem from "../components/menu-item";
import Text from "../components/text";

const homeVariants = tv({
    slots: {
        wrapper: "flex w-full h-screen bg-gray-100 overflow-hidden",
        leftPanel: "hidden lg:flex w-1/2 p-5",
        imageContainer: "relative w-full h-full rounded-[2rem] overflow-hidden",
        imageElement: "absolute inset-0 w-full h-full object-cover z-0",
        imageGradient:
            "absolute inset-0 bg-gradient-to-t from-gray-100 via-gray-100/20 to-transparent z-10",
        logoWrapper: "absolute top-10 left-10 z-20 flex items-center",
        logoBubbleLight: "w-6 h-8 bg-purple-light rounded-full opacity-90",
        logoBubbleBase: "w-8 h-8 bg-purple-base rounded-full -ml-2",
        promoTextWrapper: "absolute bottom-12 left-10 z-20 flex flex-col gap-3",
        promoTextSubtitle: "text-white/80 lowercase tracking-wider",
        promoTextTitle: "text-white leading-tight max-w-[380px]",
        rightPanel: "w-full lg:w-1/2 flex items-center justify-center p-8",
        formContainer: "w-full max-w-[380px] flex flex-col",
        toggleWrapper: "flex justify-center w-full mb-16",
        toggleList: "flex w-[320px] bg-gray-200 p-1.5 rounded-xl [&>li]:flex-1",
        toggleItem: "w-full",
        formContent: "flex flex-col gap-8",
        formTitle: "text-white",
        inputGroup: "flex flex-col gap-4",
        submitButton: "mt-2 h-12",
    },
});

export default function PageHome() {
    const {
        wrapper,
        leftPanel,
        imageContainer,
        imageElement,
        imageGradient,
        logoWrapper,
        logoBubbleLight,
        logoBubbleBase,
        promoTextWrapper,
        promoTextSubtitle,
        promoTextTitle,
        rightPanel,
        formContainer,
        toggleWrapper,
        toggleList,
        toggleItem,
        formContent,
        formTitle,
        inputGroup,
        submitButton,
    } = homeVariants();

    return (
        <div className={wrapper()}>
            <div className={leftPanel()}>
                <div className={imageContainer()}>
                    <img
                        src={Image}
                        alt="Background"
                        className={imageElement()}
                    />
                    <div className={imageGradient()}></div>

                    <div className={logoWrapper()}>
                        <div className={logoBubbleLight()}></div>
                        <div className={logoBubbleBase()}></div>
                    </div>

                    <div className={promoTextWrapper()}>
                        <Text
                            variant="text-md"
                            weight="bold"
                            className={promoTextSubtitle()}
                        >
                            ab filmes
                        </Text>
                        <Text variant="display-md" className={promoTextTitle()}>
                            O guia definitivo para os amantes do cinema
                        </Text>
                    </div>
                </div>
            </div>

            <div className={rightPanel()}>
                <div className={formContainer()}>
                    <div className={toggleWrapper()}>
                        <ul className={toggleList()}>
                            <MenuItem className={toggleItem()} size="sm" to="/">
                                Login
                            </MenuItem>
                            <MenuItem
                                className={toggleItem()}
                                size="sm"
                                to="/register"
                            >
                                Cadastro
                            </MenuItem>
                        </ul>
                    </div>

                    <div className={formContent()}>
                        <Text
                            as="h1"
                            variant="display-xl"
                            className={formTitle()}
                        >
                            Acesse sua conta
                        </Text>

                        <div className={inputGroup()}>
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

                        <Button size="full" className={submitButton()}>
                            Entrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
