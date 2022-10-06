import { Column, Entity, Index } from 'typeorm'
import { UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Point } from 'geojson'

@Entity('StandardStationCoHistory', { schema: 'public' })
export class StandardStationCoHistory {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column("text", { name: 'deviceId' })
  deviceId: string

  @Column()
  updateTime: Date

  @Column("double precision", { name: 'coValue', nullable: true, default: '0' })
  coValue: number | null

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true
  })
  coordinate: Point
}