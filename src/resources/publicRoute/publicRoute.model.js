import moongose from 'mongoose'

const publicRouteSchema = new moongose.Schema(
  {
    route: {
      type: moongose.SchemaTypes.ObjectId,
      ref: 'route',
      required: true
    },
    passengers: {
      type: [moongose.SchemaTypes.ObjectId],
      ref: 'user',
      required: true,
      default: []
    },
    passengersRoute: {
      type: [moongose.SchemaTypes.ObjectId],
      ref: 'route',
      required: true,
      default: []
    },
    createdBy: {
      type: moongose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    },
  },
  { timestamps: true }
)

// publicRouteSchema.index({ createdBy: 1 }, { unique: true })

export const PublicRoute = moongose.model('publicRoute', publicRouteSchema)
