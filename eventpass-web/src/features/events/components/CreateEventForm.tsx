import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { tv } from "tailwind-variants";
import TitleIcon from "../../../assets/icons/FilmSlate-Regular.svg?react";
import CalendarIcon from "../../../assets/icons/calendar-blank.svg?react";
import MoneyIcon from "../../../assets/icons/currency-dollar-simple.svg?react";
import LocationIcon from "../../../assets/icons/navigation-arrow.svg?react";
import CapacityIcon from "../../../assets/icons/users-three.svg?react";
import Button from "../../../components/button";
import InputText from "../../../components/input-text";
import InputTextArea from "../../../components/input-text-area";
import Text from "../../../components/text";
import { createEventSchema, type CreateEventFormData } from "../schema";

const createEventVariants = tv({
    slots: {
        wrapper: "flex flex-col md:flex-row gap-16 w-full max-w-7xl mx-auto",
        uploadBox:
            "w-full md:w-100 h-96 md:h-auto bg-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors border-2 border-transparent hover:border-purple-base/50 border-dashed",
        uploadIcon: "mb-4 stroke-purple-light",
        uploadText: "text-gray-500 font-bold",
        formArea: "flex-1 flex flex-col gap-6",
        sectionTitle: "text-white font-bold mb-2",
        row: "grid grid-cols-1 sm:grid-cols-2 gap-6",
        actions: "flex items-center justify-end gap-4 mt-4",
        cancelBtn: "text-gray-500 hover:text-white",
    },
});

export default function CreateEventForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateEventFormData>({
        resolver: zodResolver(createEventSchema),
        mode: "onChange",
    });

    const {
        wrapper,
        uploadBox,
        uploadIcon,
        uploadText,
        formArea,
        sectionTitle,
        row,
        actions,
        cancelBtn,
    } = createEventVariants();

    async function onSubmit(data: CreateEventFormData) {
        console.log(data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={wrapper()}>
            <div className={uploadBox()}>
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={uploadIcon()}
                >
                    <path
                        d="M12 16V4M12 4L8 8M12 4L16 8M4 20H20"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <Text variant="text-sm" className={uploadText()}>
                    Fazer upload
                </Text>
            </div>

            <div className={formArea()}>
                <Text as="h2" variant="title-lg" className={sectionTitle()}>
                    Novo evento
                </Text>

                <InputText
                    placeholder="Título do Evento"
                    icon={TitleIcon}
                    error={errors.title?.message}
                    {...register("title")}
                />

                <div className={row()}>
                    <InputText
                        placeholder="Data de início"
                        className="scheme-dark"
                        icon={CalendarIcon}
                        type="datetime-local"
                        error={errors.start_date?.message}
                        {...register("start_date")}
                    />

                    <InputText
                        placeholder="Localização"
                        icon={LocationIcon}
                        error={errors.location?.message}
                        {...register("location")}
                    />
                </div>

                <div className={row()}>
                    <InputText
                        placeholder="Capacidade Total"
                        icon={CapacityIcon}
                        type="number"
                        error={errors.total_capacity?.message}
                        {...register("total_capacity", {
                            setValueAs: (v) =>
                                v === "" ? undefined : Number(v),
                        })}
                    />

                    <InputText
                        placeholder="Preço (R$)"
                        icon={MoneyIcon}
                        type="number"
                        step="0.01"
                        error={errors.price?.message}
                        {...register("price", {
                            setValueAs: (v) =>
                                v === "" ? undefined : Number(v),
                        })}
                    />
                </div>

                <InputTextArea
                    placeholder="Descrição"
                    className="min-h-32"
                    error={errors.description?.message}
                    {...(register("description"), { valueAsFloat: true })}
                />

                <div className={actions()}>
                    <Button
                        type="button"
                        variant="ghost"
                        className={cancelBtn()}
                    >
                        Cancelar
                    </Button>
                    <Button
                        isLoading={isSubmitting}
                        className="w-32"
                        type="submit"
                    >
                        Salvar
                    </Button>
                </div>
            </div>
        </form>
    );
}
