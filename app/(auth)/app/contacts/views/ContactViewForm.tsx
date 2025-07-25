"use client";

import { useState } from "react";
import FormViewTemplate, {
  TFormState,
} from "@/components/templates/FormViewTemplate";
import { useForm, SubmitHandler } from "react-hook-form";

const formStates: TFormState[] = [];

type TInputs = {
  name: string;
};

function ContactViewForm() {
  const [disabled, setDisabled] = useState(false);

  const {
    handleSubmit,
    formState: { isDirty },
  } = useForm<TInputs>();

  const onSubmit: SubmitHandler<TInputs> = async () => {
    setDisabled(true);
  };

  const handleRevert = () => {};

  //  PASAR EL PARTNERTYPE EN VIEWFORM
  return (
    <FormViewTemplate
      viewForm="/app/contacts?view_mode=form&id=null"
      formActions={[]}
      formStates={formStates}
      name={"contactos"}
      state={""}
      onSubmit={handleSubmit(onSubmit)}
      disableForm={disabled}
      isDirty={isDirty}
      revert={handleRevert}
    ></FormViewTemplate>
  );
}

export default ContactViewForm;
