import { Column, Entity, Index } from 'typeorm'
import { UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Point } from 'geojson'

@Entity('MobileHistory', { schema: 'public' })
export class MobileHistory {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column("text", { name: 'deviceId' })
  deviceId: string

  @Column()
  @UpdateDateColumn()
  updateTime: Date

  @Column("double precision", { name: 'pm25UartValue', nullable: true, default: '0' })
  pm25UartValue: number | null

  @Column("double precision", { name: 'vocValue', nullable: true, default: '0' })
  vocValue: number | null

  @Column("double precision", { name: 'pm25I2cValue', nullable: true, default: '0' })
  pm25I2cValue: number | null

  @Column("double precision", { name: 'coValue', nullable: true, default: '0' })
  coValue: number | null

  @Column("double precision", { name: 'temperature', nullable: true, default: '0' })
  temperature: number | null

  @Column("double precision", { name: 'humidity', nullable: true, default: '0' })
  humidity: number | null

  @Column("double precision", { name: 'flow', nullable: true, default: '0' })
  flow: number | null

  @Column("double precision", { name: 'speed', nullable: true, default: '0' })
  speed: number | null

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true
  })
  coordinate: Point
}