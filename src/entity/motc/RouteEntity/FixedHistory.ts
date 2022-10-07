import { Column, Entity, Index } from 'typeorm'
import { UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Point } from 'geojson'

@Entity('FixedHistory', { schema: 'public' })
export class FixedHistory {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column("text", { name: 'deviceId' })
  deviceId: string

  @Column()
  updateTime: Date

  @Column("double precision", { name: 'pm25Value', nullable: true, default: '0' })
  pm25Value: number | null

  @Column("double precision", { name: 'vocValue', nullable: true, default: '0' })
  vocValue: number | null

  @Column("double precision", { name: 'temperature', nullable: true, default: '0' })
  temperature: number | null

  @Column("double precision", { name: 'humidity', nullable: true, default: '0' })
  humidity: number | null


  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true
  })
  coordinate: Point
}