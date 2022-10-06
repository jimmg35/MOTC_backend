import { Column, Entity, Index } from 'typeorm'
import { UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Point } from 'geojson'

@Entity('StandardStationPM25History', { schema: 'public' })
export class StandardStationPM25History {

  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column("text", { name: 'deviceId' })
  deviceId: string

  @Column()
  updateTime: Date

  @Column("double precision", { name: 'pm25Value', nullable: true, default: '0' })
  pm25Value: number | null
  
  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true
  })
  coordinate: Point
}