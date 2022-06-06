import { Column, Entity, Index } from 'typeorm'
import { UpdateDateColumn } from 'typeorm'

@Entity('RealTime_PM25', { schema: 'public' })
export class RealTimePm25 {

  @Column("text", { primary: true, name: 'deviceId' })
  deviceId: string

  @Column()
  @UpdateDateColumn()
  updateTime: Date

  @Column("text", { name: 'value', nullable: true })
  value: number | null

  @Column("geography", { name: "coordinate", nullable: true })
  coordinate: string | null
}