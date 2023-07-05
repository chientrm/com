import * as yup from 'yup';

const validate = async <TShape extends yup.ObjectShape>(
  request: Request,
  spec: TShape
) => {
  const formData = await request.formData(),
    object = Object.keys(spec).reduce(
      (a, b) => ({ ...a, [b]: formData.get(b) }),
      {}
    ),
    result = yup.object(spec).validate(object);
  return result;
};
async function validate2<TShape extends yup.ObjectShape>(
  request: Request,
  spec: TShape
) {
  try {
    const form = await validate(request, spec);
    return { form };
  } catch (e: any) {
    const message = e.message as string;
    return { message };
  }
}

export { validate, validate2 };
