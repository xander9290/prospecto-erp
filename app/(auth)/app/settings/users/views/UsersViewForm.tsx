"use client";

import FormViewTemplate, {
  TFormState,
  ViewGroup,
  ViewGroupFluid,
} from "@/components/templates/FormViewTemplate";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  createUser,
  fetchUser,
  updateUser,
  userImageUpdate,
} from "@/app/actions/user-actions";
import { useRouter } from "next/navigation";
import ImageSource from "@/components/ImageSource";

const formStates: TFormState[] = [
  {
    name: "no_active",
    label: "inactivo",
  },
  {
    name: "active",
    label: "activo",
  },
];

type TInputs = {
  userName: string;
  password: string;
  email: string;
  name: string;
  state: string;
  imageId: string | null;
};

const defaultValues: TInputs = {
  userName: "",
  password: "",
  email: "",
  name: "",
  state: "",
  imageId: "",
};

function UserViewForm() {
  const originalValuesRef = useRef<TInputs | null>(null);

  const [disabled, setDisabled] = useState(false);

  const searchParams = useSearchParams();
  const modelId = searchParams.get("id");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<TInputs>();

  const [name, state, imageId] = watch(["name", "state", "imageId"]);

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    if (modelId === "null") {
      setDisabled(true);
      const res = await createUser(data);
      if (!res.success) {
        toast.error(res.message);
        setDisabled(false);
        return;
      }
      router.replace(`/app/settings/users?view_mode=form&id=${res.data}`);
    } else {
      setDisabled(true);
      const newData = {
        ...data,
        id: modelId || "",
      };
      const res = await updateUser(newData);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      reset({
        ...newData,
      });
      setDisabled(false);
    }
  };

  const handleFetchUser = async (id: string | null) => {
    if (!id) return;

    setDisabled(true);
    const res = await fetchUser({ id });

    if (!res.success) {
      toast.error(res.message, { position: "top-right" });
      return;
    }

    const newData: TInputs = {
      userName: res.data?.userName || "",
      email: res.data?.email || "",
      name: res.data?.relatedPartner.name || "",
      password: "", // si quieres dejarlo vacío
      state: res.data?.state || "",
      imageId: res.data?.Partner.imageId || null,
    };

    originalValuesRef.current = newData;

    reset(newData);

    setDisabled(false);
  };

  const handleRevert = () => {
    if (originalValuesRef.current) {
      reset(originalValuesRef.current);
      toast.success("Cambios revertidos");
    } else {
      toast.error("No hay datos anteriores para revertir");
    }
  };

  const handleImageId = async (imageId: string) => {
    if (!imageId) return;
    await userImageUpdate({ id: modelId || "", imageId });
  };

  useEffect(() => {
    if (modelId !== "null") {
      handleFetchUser(modelId);
    } else {
      originalValuesRef.current = defaultValues;
      reset({
        userName: "",
        state: "",
        name: "",
        password: "",
        email: "",
        imageId: null,
      });
    }
  }, [searchParams]);

  return (
    <FormViewTemplate
      viewForm="/app/settings/users?view_mode=form&id=null"
      formActions={[]}
      formStates={formStates}
      name={name}
      state={state}
      onSubmit={handleSubmit(onSubmit)}
      disableForm={disabled}
      isDirty={isDirty}
      revert={handleRevert}
    >
      <ViewGroupFluid classname="d-flex justify-content-end">
        <ImageSource
          entityType="users"
          sourceId={imageId}
          width={125}
          height={125}
          editable={true}
          remove={true}
          getImageId={handleImageId}
        />
      </ViewGroupFluid>
      <ViewGroup>
        <Form.Group controlId="UserUserName" className="mb-3">
          <Form.Label>Usuario:</Form.Label>
          <Form.Control
            {...register("userName", { required: "Este campo es requerido" })}
            type="text"
            isInvalid={!!errors.userName}
            autoComplete="off"
            size="sm"
          />
          <Form.Control.Feedback type="invalid">
            {errors.userName?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="UserState" className="mb-3">
          <Form.Label>Estado:</Form.Label>
          <Form.Select
            size="sm"
            {...register("state", { required: "Este campo es requerido" })}
            isInvalid={!!errors.state}
          >
            <option value=""></option>
            <option value="no_active">Inactivo</option>
            <option value="active">Activo</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.state?.message}
          </Form.Control.Feedback>
        </Form.Group>
        {/* <Form.Group controlId="UserGroup" className="mb-3">
          <Form.Label>Grupo:</Form.Label>
          <Many2oneField<TInputs>
            model="user"
            {...register("group", { required: "Este campo es requerido" })}
            control={control}
            isInvalid={!!errors.group}
          />
        </Form.Group> */}
      </ViewGroup>

      <ViewGroup>
        <Form.Group controlId="UserName" className="mb-3">
          <Form.Label>Nombre:</Form.Label>
          <Form.Control
            {...register("name", { required: "Este campo es requerido" })}
            type="text"
            autoComplete="off"
            isInvalid={!!errors.name}
            size="sm"
          />
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="UserEmail" className="mb-3">
          <Form.Label>Correo:</Form.Label>
          <Form.Control
            {...register("email")}
            type="email"
            autoComplete="off"
            size="sm"
          />
        </Form.Group>
        {/* <Form.Group>
          <Form.Label>Creado por:</Form.Label>
          <Many2oneField
            {...register("createdById")}
            model="user"
            control={control}
            disabled
          />
        </Form.Group> */}
      </ViewGroup>
    </FormViewTemplate>
  );
}

export default UserViewForm;
