"use client";

import { useEffect, useRef, useState } from "react";
import FormViewTemplate, {
  Notebook,
  NotePage,
  TFormState,
  ViewGroup,
} from "@/components/templates/FormViewTemplate";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { PartnerType, Partner } from "@/generate/prisma";
import { Form } from "react-bootstrap";
import ImageSource from "@/components/ImageSource";
import Many2oneField from "@/components/Many2oneField";
import { createPartner, fetchPartner } from "../contacts-actions";
import toast from "react-hot-toast";
import { PartnerContacts } from "@/libs/definitions";
import { userImageUpdate } from "@/app/actions/user-actions";

const formStates: TFormState[] = [];

type TInputs = Omit<
  Partner,
  "createdAt" | "updatedAt" | "createdById" | "displayName" | "id"
>;

const displayTypes = {
  CUSTOMER: "cliente",
  SUPPLIER: "proveedor",
  INTERNAL: "empleado",
};

export type ContactFilter = "CUSTOMER" | "SUPPLIER" | "INTERNAL";

const initFields: TInputs = {
  name: "",
  email: "",
  phone: "",
  street: "",
  colony: "",
  crossStreets: "",
  city: "",
  province: "",
  imageId: null,
  userId: null,
  displayType: "INTERNAL",
  state: "",
};

function ContactViewForm() {
  const originalValuesRef = useRef<TInputs | null>(initFields);

  const [disabled, setDisabled] = useState(false);

  const router = useRouter();

  // CAPTURA DE PARÁMETROS
  const searchParams = useSearchParams();
  const partnerType = searchParams.get("filter") as unknown as PartnerType;
  const modelId = searchParams.get("id") || null;

  const {
    register,
    reset,
    watch,
    handleSubmit,
    control,
    formState: { isDirty, errors },
  } = useForm<TInputs>({
    defaultValues: initFields,
  });

  const [imageId] = watch(["imageId"]);

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    const toastId = toast.loading("Cargando...", { position: "bottom-right" });
    setDisabled(true);
    if (modelId && modelId === "null") {
      const newPartner: TInputs = {
        ...data,
        name: data.name.toUpperCase(),
        displayType: partnerType,
        imageId: data.imageId || null,
      };
      const res = await createPartner({ data: newPartner });
      if (!res.success) {
        setDisabled(false);
        toast.error(res.message, { id: toastId });
        return;
      }

      router.replace(
        `/app/contacts?view_mode=form&id=${res.data}&filter=${partnerType}`
      );
    }
    setDisabled(false);
    toast.dismiss(toastId);
  };

  const handleRevert = () => {
    if (originalValuesRef.current) {
      reset(originalValuesRef.current);
    }
  };

  const handleImageId = async (imageId: string | null) => {
    if (!imageId) return;
    await userImageUpdate({ id: modelId || "", imageId });
  };

  const handleFetchPartner = async () => {
    const toastId = toast.loading("Cargando...", { position: "top-right" });
    setDisabled(true);
    const res = await fetchPartner({ id: modelId });
    if (!res.success) {
      toast.error(res.message, { id: toastId });
      return;
    }

    const partner = res.data as PartnerContacts;

    originalValuesRef.current = partner;
    reset(partner);
    setDisabled(false);
    toast.dismiss(toastId);
  };

  useEffect(() => {
    if (modelId && modelId !== "null") {
      handleFetchPartner();
    } else {
      originalValuesRef.current = initFields;
      reset(initFields);
    }
  }, [modelId]);

  // QUEDA PENDIENTE EL CAMBIO DE IMAGEN
  // VISTA KANABAN PARA MODELO PARTNER CON OPCIÓN DE VER LISTA TABLE

  return (
    <FormViewTemplate
      viewForm={`/app/contacts?view_mode=form&id=null&filter=${partnerType}`}
      formActions={[]}
      formStates={formStates}
      name={displayTypes[partnerType]}
      state={""}
      onSubmit={handleSubmit(onSubmit)}
      disableForm={disabled}
      isDirty={isDirty}
      revert={handleRevert}
    >
      <ViewGroup title="datos personales">
        <Form.Group controlId="PartnerImage" className="text-center">
          <ImageSource
            entityType="users"
            width={125}
            height={125}
            sourceId={imageId || null}
            editable={modelId !== "null"}
            remove={true}
            getImageId={handleImageId}
          />
        </Form.Group>
        <Form.Group controlId="PartnerName" className="mb-3">
          <Form.Label>Nombre:</Form.Label>
          <Form.Control
            {...register("name", { required: "Este campo es requerido" })}
            isInvalid={!!errors.name}
            autoComplete="off"
            type="text"
            size="sm"
          />
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>
        {/*  */}
        <Form.Group controlId="PartnerPhone" className="mb-3">
          <Form.Label>Teléfono:</Form.Label>
          <Form.Control
            {...register("phone", { required: "Este campo es requerido" })}
            isInvalid={!!errors.phone}
            autoComplete="off"
            type="text"
            size="sm"
          />
          <Form.Control.Feedback type="invalid">
            {errors.phone?.message}
          </Form.Control.Feedback>
        </Form.Group>
        {/*  */}
        <Form.Group controlId="PartnerEmail" className="mb-3">
          <Form.Label>Correo:</Form.Label>
          <Form.Control
            {...register("email")}
            autoComplete="off"
            type="email"
            size="sm"
          />
        </Form.Group>
      </ViewGroup>
      <ViewGroup title="Dirección">
        {/*  */}
        <Form.Group controlId="PartnerStreet" className="mb-3">
          <Form.Label>Calle:</Form.Label>
          <Form.Control
            {...register("street", { required: "Este campo es requerido" })}
            isInvalid={!!errors.street}
            autoComplete="off"
            type="text"
            size="sm"
          />
          <Form.Control.Feedback type="invalid">
            {errors.street?.message}
          </Form.Control.Feedback>
        </Form.Group>
        {/*  */}
        <Form.Group controlId="PartnerCrossStreet" className="mb-3">
          <Form.Label>Cruces:</Form.Label>
          <Form.Control
            {...register("crossStreets")}
            autoComplete="off"
            type="text"
            size="sm"
          />
        </Form.Group>
        {/*  */}
        <Form.Group controlId="PartnerColony" className="mb-3">
          <Form.Label>Colonia:</Form.Label>
          <Form.Control
            {...register("colony")}
            autoComplete="off"
            type="text"
            size="sm"
          />
        </Form.Group>
        {/*  */}
        <Form.Group controlId="PartnerCity" className="mb-3">
          <Form.Label>Ciudad:</Form.Label>
          <Form.Control
            {...register("city")}
            autoComplete="off"
            type="text"
            size="sm"
          />
        </Form.Group>
        {/*  */}
        <Form.Group controlId="PartnerState" className="mb-3">
          <Form.Label>Estado:</Form.Label>
          <Form.Control
            {...register("state")}
            autoComplete="off"
            type="text"
            size="sm"
          />
        </Form.Group>
      </ViewGroup>
      <Notebook dKey="otherAddresses">
        <NotePage eventKey="otherAddresses" title="Contactos y direcciones">
          <h6>otras direcciones</h6>
        </NotePage>
        <NotePage eventKey="salePurchase" title="Venta y Compra">
          <ViewGroup title="ventas">
            <Form.Group controlId="UserId">
              <Form.Label>Agente:</Form.Label>
              <Many2oneField
                {...register("userId")}
                model="user"
                control={control}
              />
            </Form.Group>
          </ViewGroup>
        </NotePage>
        <NotePage eventKey="otherInfo" title="Otra información">
          <h6>otra información</h6>
        </NotePage>
      </Notebook>
    </FormViewTemplate>
  );
}

export default ContactViewForm;
