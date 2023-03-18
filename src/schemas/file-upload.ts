import Joi, { Schema } from "joi";

export const uploadFileSchema: Schema = Joi.object({
  headers: Joi.object({
    "content-length": Joi.string().required(),
  }),
});
