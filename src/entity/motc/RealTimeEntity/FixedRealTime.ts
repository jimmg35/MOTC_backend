import { Column, Entity, Index } from 'typeorm'
import { UpdateDateColumn } from 'typeorm'
import { Point } from 'geojson'

@Entity('FixedRealTime', { schema: 'public' })
export class FixedRealTime {

  @Column("text", { primary: true, name: 'deviceId' })
  deviceId: string

  @Column()
  @UpdateDateColumn()
  updateTime: Date

  @Column("text", { name: 'pm25Value', nullable: true, default: '0' })
  pm25Value: number | null

  @Column("text", { name: 'vocValue', nullable: true, default: '0' })
  vocValue: number | null

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true
  })
  coordinate: Point
}