"use client";

import FormViewTemplate, {
  TFormState,
  ViewGroup,
} from "@/components/templates/FormViewTemplate";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { createUser, fetchUser, updateUser } from "@/app/actions/user-actions";
import { useRouter } from "next/navigation";
import Many2oneField from "@/components/Many2oneField";

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
  group: string;
};

function UserViewForm() {
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

  const [name, state] = watch(["name", "state"]);

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

    reset({
      userName: res.data?.userName || "",
      email: res.data?.email || "",
      name: res.data?.Partner.name || "",
      password: "", // si quieres dejarlo vacío
      state: res.data?.state,
      group: "",
    });
    setDisabled(false);
  };

  const getGroupId = (id: string | number) => {
    console.log(id);
  };

  useEffect(() => {
    if (modelId !== "null") {
      handleFetchUser(modelId);
    } else {
      reset({
        userName: "",
        state: "",
        group: "",
        name: "",
        password: "",
        email: "",
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
      isDirty={!isDirty}
    >
      <ViewGroup>
        <Form.Group controlId="UserUserName" className="mb-3">
          <Form.Label>Usuario:</Form.Label>
          <Form.Control
            {...register("userName", { required: "Este campo es requerido" })}
            type="text"
            isInvalid={!!errors.userName}
            autoComplete="off"
          />
          <Form.Control.Feedback type="invalid">
            {errors.userName?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="UserState" className="mb-3">
          <Form.Label>Estado:</Form.Label>
          <Form.Select
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
        <Form.Group controlId="UserGroup" className="mb-3">
          <Form.Label>Grupo:</Form.Label>
          {/* <Form.Select
            {...register("group", { required: "Este campo es requerido" })}
            isInvalid={!!errors.group}
          >
            <option value=""></option>
            <option value="active">Activo</option>
          </Form.Select> */}
          {/* <Form.Control.Feedback type="invalid">
            {errors.group?.message}
          </Form.Control.Feedback> */}
          <Many2oneField model="partner" onChange={getGroupId} />
        </Form.Group>
      </ViewGroup>

      <ViewGroup>
        <Form.Group controlId="UserName" className="mb-3">
          <Form.Label>Nombre:</Form.Label>
          <Form.Control
            {...register("name", { required: "Este campo es requerido" })}
            type="text"
            autoComplete="off"
            isInvalid={!!errors.name}
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
          />
        </Form.Group>
      </ViewGroup>
    </FormViewTemplate>
  );
}

export default UserViewForm;
