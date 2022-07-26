import { Column, Entity, Index } from 'typeorm'
import { UpdateDateColumn } from 'typeorm'
import { Point } from 'geojson'

@Entity('MobileRealTime', { schema: 'public' })
export class MobileRealTime {

  @Column("text", { primary: true, name: 'deviceId' })
  deviceId: string

  @Column()
  @UpdateDateColumn()
  updateTime: Date

  @Column("text", { name: 'pm25UartValue', nullable: true, default: '0' })
  pm25UartValue: number | null

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