import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios"; // Importação do Axios adicionada
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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

import type { Category } from "../../categories/models/category.types";
import type { Event } from "../models/event.types";
import { createEventSchema, type CreateEventFormData } from "../schema";

const EventVariants = tv({
    slots: {
        wrapper: "flex flex-col lg:flex-row gap-12 w-full max-w-7xl mx-auto",
        uploadBox:
            "w-full lg:w-112.5 h-180 border border-white/10 rounded-4xl flex flex-col items-center justify-center gap-4 bg-white/5 hover:bg-white/10 transition-all cursor-pointer overflow-hidden relative group shrink-0",
        uploadIcon:
            "w-10 h-10 text-white/40 group-hover:text-white/80 transition-colors",
        uploadText:
            "text-white/40 group-hover:text-white/80 text-center px-8 font-medium transition-colors",
        formArea: "flex-1 flex flex-col gap-6",
        sectionTitle: "",
        inputGroup: "flex flex-col gap-8",
        row: "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 items-start",
        actions:
            "flex items-center justify-end gap-4 mt-2 pt-8 border-t border-white/10",
        cancelBtn:
            "text-white/50 hover:text-white font-medium transition-colors px-4",
        categoryContainer: "flex flex-wrap gap-3",
        categoryPill:
            "px-5 py-2.5 rounded-full border text-sm font-semibold transition-all cursor-pointer",
        categoryPillActive: "bg-white border-white text-black",
        categoryPillInactive:
            "bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white",
    },
});

interface EventFormProps {
    event?: Event;
    categories: Category[];
    onSubmit: (
        data: CreateEventFormData,
        bannerFile: File | null,
    ) => Promise<void>;
    onCancelEvent?: () => Promise<void>;

    isSubmitLoading?: boolean;
    isCancelLoading?: boolean;
    submitError?: Error | null;
    cancelError?: Error | null;
}

export default function EventForm({
    event,
    categories,
    onSubmit,
    onCancelEvent,
    isSubmitLoading,
    isCancelLoading,
    submitError,
    cancelError,
}: EventFormProps) {
    const navigate = useNavigate();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [bannerFile, setBannerFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const apiUrl = import.meta.env.VITE_API_URL.replace(/\/$/, "");

    const isPastEvent = event
        ? new Date(event.start_date).getTime() < new Date().getTime()
        : false;

    function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setBannerFile(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);
        }
    }

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CreateEventFormData>({
        resolver: zodResolver(createEventSchema),
        mode: "onChange",
        defaultValues: event
            ? {
                  title: event.title,
                  description: event.description,
                  start_date: event.start_date.slice(0, 16),
                  location: event.location,
                  total_capacity: event.total_capacity,
                  price: Number(event.price),
                  categories: event.categories.map((c) => c.name),
              }
            : {
                  title: "",
                  description: "",
                  start_date: "",
                  location: "",
                  total_capacity: 0,
                  price: 0,
                  categories: [],
              },
    });

    const {
        wrapper,
        uploadBox,
        uploadIcon,
        uploadText,
        formArea,
        sectionTitle,
        inputGroup,
        row,
        actions,
        cancelBtn,
        categoryContainer,
        categoryPill,
        categoryPillActive,
        categoryPillInactive,
    } = EventVariants();

    // eslint-disable-next-line react-hooks/incompatible-library
    const selectedCategories = watch("categories") || [];

    const toggleCategory = (categoryName: string) => {
        if (selectedCategories.includes(categoryName)) {
            setValue(
                "categories",
                selectedCategories.filter((name) => name !== categoryName),
                { shouldValidate: true },
            );
        } else {
            setValue("categories", [...selectedCategories, categoryName], {
                shouldValidate: true,
            });
        }
    };

    // 3. O coração do Error Bubbling e injeção!
    const handleFormSubmit: SubmitHandler<CreateEventFormData> = async (
        data,
    ) => {
        try {
            await onSubmit(data, bannerFile);
        } catch (err) {
            if (isAxiosError(err) && err.response?.data?.errors) {
                const backendErrors = err.response.data.errors;

                backendErrors.forEach(
                    (backendError: { field: string; message: string }) => {
                        setError(
                            backendError.field as keyof CreateEventFormData,
                            {
                                type: "server",
                                message: backendError.message,
                            },
                        );
                    },
                );
                return;
            }
        }
    };

    let submitErrorMessage = submitError?.message;
    let cancelErrorMessage = cancelError?.message;

    if (isAxiosError(submitError)) {
        if (!submitError.response?.data?.errors) {
            submitErrorMessage =
                submitError.response?.data?.message || submitError.message;
        } else {
            submitErrorMessage = undefined;
        }
    }

    if (isAxiosError(cancelError)) {
        cancelErrorMessage =
            cancelError.response?.data?.message || cancelError.message;
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={wrapper()}>
            <div
                className={uploadBox()}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileSelected}
                />

                {previewUrl || event?.banner_url ? (
                    <img
                        src={
                            previewUrl || `${apiUrl}/files/${event?.banner_url}`
                        }
                        className="w-full h-full object-cover rounded-4xl"
                        alt="Preview"
                    />
                ) : (
                    <>
                        <div className={uploadIcon()}>
                            <svg
                                width="100%"
                                height="100%"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 5V19M5 12H19"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <Text className={uploadText()}>
                            Clique para adicionar uma capa
                        </Text>
                    </>
                )}
            </div>

            <div className={formArea()}>
                <div className={inputGroup()}>
                    <div className={sectionTitle()}>
                        <Text variant="title-lg" color="button" weight="bold">
                            Informações do Evento
                        </Text>
                    </div>

                    <InputText
                        placeholder="Título"
                        icon={TitleIcon}
                        {...register("title")}
                        error={errors.title?.message}
                    />

                    <InputTextArea
                        placeholder="Descrição"
                        className="h-40"
                        {...register("description")}
                        error={errors.description?.message}
                    />

                    <div className={row()}>
                        <InputText
                            type="datetime-local"
                            placeholder="Data e Hora"
                            icon={CalendarIcon}
                            {...register("start_date")}
                            error={errors.start_date?.message}
                        />
                        <InputText
                            placeholder="Localização"
                            icon={LocationIcon}
                            {...register("location")}
                            error={errors.location?.message}
                        />
                    </div>

                    <div className={row()}>
                        <InputText
                            type="number"
                            placeholder="Capacidade Total"
                            icon={CapacityIcon}
                            {...register("total_capacity", {
                                valueAsNumber: true,
                            })}
                            error={errors.total_capacity?.message}
                        />
                        <InputText
                            type="number"
                            step="0.01"
                            placeholder="Preço"
                            icon={MoneyIcon}
                            {...register("price", { valueAsNumber: true })}
                            error={errors.price?.message}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className={sectionTitle()}>
                        <Text variant="title-lg" color="button" weight="bold">
                            Categorias
                        </Text>
                    </div>

                    {categories.length > 0 && (
                        <div className={categoryContainer()}>
                            {categories.map((category) => {
                                const isActive = selectedCategories.includes(
                                    category.name,
                                );
                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() =>
                                            toggleCategory(category.name)
                                        }
                                        className={`${categoryPill()} ${isActive ? categoryPillActive() : categoryPillInactive()}`}
                                    >
                                        {category.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    {errors.categories && (
                        <Text
                            variant="text-sm"
                            className="text-error-light mt-4"
                        >
                            {errors.categories.message}
                        </Text>
                    )}
                </div>

                {submitErrorMessage && (
                    <Text
                        variant="text-sm"
                        className="text-error-light mt-4 text-center bg-error-base/10 p-4 rounded-xl border border-error-base/20"
                    >
                        {submitErrorMessage}
                    </Text>
                )}

                <div className={actions()}>
                    <button
                        type="button"
                        className={cancelBtn()}
                        onClick={() => navigate(-1)}
                    >
                        Voltar
                    </button>

                    {!isPastEvent &&
                        event &&
                        event.status !== "cancelled" &&
                        onCancelEvent && (
                            <div className="flex flex-col items-center">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-error-base text-error-light hover:bg-error-base/10 px-8"
                                    onClick={onCancelEvent}
                                    isLoading={isCancelLoading}
                                    disabled={isSubmitting || isSubmitLoading}
                                >
                                    Cancelar Evento
                                </Button>

                                {cancelErrorMessage && (
                                    <Text
                                        variant="text-sm"
                                        className="text-error-base mt-2 font-bold"
                                    >
                                        {cancelErrorMessage}
                                    </Text>
                                )}
                            </div>
                        )}

                    <Button
                        type="submit"
                        className="w-40"
                        isLoading={isSubmitting || isSubmitLoading}
                        disabled={isCancelLoading}
                    >
                        Salvar
                    </Button>
                </div>
            </div>
        </form>
    );
}
