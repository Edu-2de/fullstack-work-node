import { zodResolver } from "@hookform/resolvers/zod";
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

import { useCategories } from "../../categories/hooks/useCategories";
import { useCreateEvent } from "../hooks/useCreateEvent";
import {
    createEventSchema,
    type CreateEventFormData,
    type UpdateEventFormData,
} from "../schema";

import { useUpdateEvent } from "../hooks/useUpdateEvent";
import type { Event } from "../models/event.types";

const EventVariants = tv({
    slots: {
        wrapper: "flex flex-col md:flex-row gap-16 w-full max-w-7xl mx-auto",
        uploadBox:
            "w-full md:w-100 h-96 md:h-140 bg-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors border-2 border-transparent hover:border-purple-base/50 border-dashed",
        uploadIcon: "mb-4 stroke-purple-light",
        uploadText: "text-gray-500 font-bold",
        formArea: "flex-1 flex flex-col gap-6",
        sectionTitle: "text-white font-bold mb-2",
        row: "grid grid-cols-1 sm:grid-cols-2 gap-6",
        actions: "flex items-center justify-end gap-4 mt-4",
        cancelBtn: "text-gray-500 hover:text-white",
        categoryContainer: "flex flex-wrap gap-2 mt-2",
        categoryPill:
            "px-4 py-2 rounded-full text-sm transition-colors border cursor-pointer",
        categoryPillActive: "bg-purple-base border-purple-light text-white",
        categoryPillInactive:
            "bg-transparent border-gray-400 text-gray-400 hover:border-gray-200 hover:text-white",
    },
});

interface EventFormProps extends React.ComponentProps<"div"> {
    event?: Event;
}

export default function EventForm({ event }: EventFormProps) {
    const navigate = useNavigate();
    const { categories, isLoading: categoriesLoading } = useCategories();
    const { createEvent } = useCreateEvent();
    const { updateEvent } = useUpdateEvent(event!.id);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [bannerFile, setBannerFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const apiUrl = import.meta.env.VITE_API_URL;

    function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

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

    const onSubmit: SubmitHandler<CreateEventFormData> = async (data) => {
        try {
            await createEvent(data, bannerFile);
            navigate("/");
        } catch (error) {
            console.error("Erro ao criar evento:", error);
        }
    };

    const onEdit: SubmitHandler<UpdateEventFormData> = async (data) => {
        try {
            await updateEvent(data, bannerFile);
            navigate("/");
        } catch (error) {
            console.error("Erro ao Editar evento", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(event ? onEdit : onSubmit)}
            className={wrapper()}
        >
            <div
                className={`${uploadBox()} overflow-hidden`}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelected}
                />

                {event && event.banner_url && !previewUrl && (
                    <img
                        src={`${apiUrl}/files/${event.banner_url}`}
                        alt="Preview do evento"
                        className="w-full h-full object-cover"
                    />
                )}

                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Preview do evento"
                        className="w-full h-full object-cover"
                    />
                )}

                {!previewUrl && !event?.banner_url && (
                    <>
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
                    </>
                )}
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
                        {...register("total_capacity", { valueAsNumber: true })}
                    />
                    <InputText
                        placeholder="Preço (R$)"
                        icon={MoneyIcon}
                        type="number"
                        step="0.01"
                        error={errors.price?.message}
                        {...register("price", { valueAsNumber: true })}
                    />
                </div>

                <InputTextArea
                    placeholder="Descrição"
                    className="min-h-32"
                    error={errors.description?.message}
                    {...register("description")}
                />

                <div className="flex flex-col gap-2">
                    <Text
                        variant="text-sm"
                        className="text-gray-500 font-bold uppercase tracking-wider"
                    >
                        Categorias
                    </Text>
                    {categoriesLoading ? (
                        <Text variant="text-sm">Carregando categorias...</Text>
                    ) : (
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
                            className="text-error-light mt-1"
                        >
                            {errors.categories.message}
                        </Text>
                    )}
                </div>

                <div className={actions()}>
                    <Button
                        type="button"
                        variant="ghost"
                        className={cancelBtn()}
                        onClick={() => navigate("/")}
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
