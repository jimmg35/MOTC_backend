import { Column, Entity, Index } from 'typeorm'
import { UpdateDateColumn } from 'typeorm'
import { Point } from 'geojson'

@Entity('RealTime_PM25', { schema: 'public' })
export class RealTimePm25 {

  @Column("text", { primary: true, name: 'deviceId' })
  deviceId: string

  @Column()
  @UpdateDateColumn()
  updateTime: Date

  @Column("text", { name: 'value', nullable: true })
  value: number | null

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true
  })
  coordinate: Point
}