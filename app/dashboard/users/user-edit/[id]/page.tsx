import UserForm from "@/components/user-module/user-add";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  return (
    <UserForm
      userId={id}
      isEdit={true}
    />
  );
}