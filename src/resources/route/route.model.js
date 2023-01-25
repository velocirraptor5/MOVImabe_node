import moongose from 'mongoose';

const routeSchema = new moongose.Schema(
  {
    salida: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    llegada: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500
    },
    fecha: {
      type: Date,
      required: true,
      trim: true,
      maxlength: 50
    },
    cupos: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 50
    },
    recurrente: {
      type: Boolean,
      required: true,
      trim: true,
      maxlength: 50
    },
    vehiculo: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      default: 'Ajeno'
    },
    fecha2: {
      type: Date,
      required: false,
      trim: true,
      maxlength: 50
    },
    createdBy: {
      type: moongose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    },
  },
  { timestamps: true }
);

routeSchema.index({ createdBy: 1, salida: 1, llegada: 1, fecha: 1 }, { unique: true });

export const Route = moongose.model('route', routeSchema);
